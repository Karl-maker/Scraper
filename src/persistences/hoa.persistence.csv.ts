import { Hoa } from "../entities/hoa.entity";
import { HoaPersistence } from "../interfaces/persistence/i.hoa.persistence";
import { ICsvReadableService } from "../interfaces/services/i.csv.readable.service";
import { ICsvWritableService } from "../interfaces/services/i.csv.writable.service";
import { IssuePersistingError } from "../utils/error/issue.persisting.error";

export class HoaPersistenceCsv implements HoaPersistence {
    constructor(
        private file_path: string,
        private writeService: ICsvWritableService,
        private readService: ICsvReadableService
    ) {}

    async save<E extends Error>(hoas: Hoa[]): Promise<Hoa[] | E> {
        try {
            // Check if the file exists and initialize it if necessary
            const check = await this.writeService.writeAppend(this.file_path, [[]]);
            if (check.error) throw check.error;

            // Add the header row if the file was just initialized
            if (check.initialized) {
                await this.writeService.writeAppend(this.file_path, [
                    ['ID', 'Name', 'Address', 'Agent Name', 'Status', 'Location']
                ]);
            }

            // Remove duplicates and map HOAs to CSV rows
            const uniqueHoas = await this.removeDuplicates(hoas);
            const csvRows = this.mapHoaToCsv(uniqueHoas);

            // Write the CSV rows to the file
            await this.writeService.writeAppend(this.file_path, csvRows);
        } catch (err) {
            return err instanceof Error ? err as E : new IssuePersistingError('Hoa') as E;
        }

        return hoas;
    }

    async removeDuplicates(hoas: Hoa[]): Promise<Hoa[]> {
        const currentFile = await this.readService.read(this.file_path);

        if (currentFile instanceof Error) {
            return hoas; // If there's an error reading the file, proceed with all HOAs
        }

        const fileLines = currentFile.split("\n");

        if (fileLines.length <= 2) {
            return hoas; // If the file only contains headers or no data, return all HOAs
        }

        const existingRecords = new Set(
            fileLines
                .slice(2) // Skip the header row
                .filter(row => row.trim()) // Ensure we ignore empty lines
                .map(row => {
                    const columns = row.split(",");
                    return columns[1]?.trim(); // Extract the Name column (assuming it's the second column)
                })
                .filter(Boolean) // Remove undefined or empty values
        );

        return hoas.filter((hoa) => !existingRecords.has(hoa.name.trim()));
    }

    mapHoaToCsv(hoas: Hoa[]): string[][] {
        return hoas.map((hoa) => {
            return [
                this.escapeCsvField(hoa.id),
                this.escapeCsvField(hoa.name),
                this.escapeCsvField(hoa.mailing_address),
                this.escapeCsvField(hoa.agent_name ?? "UNAVAILABLE"),
                this.escapeCsvField(hoa.status),
                this.escapeCsvField(hoa.formed_in)
            ];
        });
    }

    /**
     * Escapes a CSV field to ensure it is properly formatted.
     * @param field The field value to escape.
     * @returns The escaped field value.
     */
    private escapeCsvField(field: string): string {
        if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
            // Escape double quotes by doubling them
            const escapedField = field.replace(/"/g, '""');
            // Wrap the field in double quotes
            return `"${escapedField}"`;
        }
        return field;
    }
}