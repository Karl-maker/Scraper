import { ICsvWritableService } from "../interfaces/services/i.csv.writable.service";
import * as fs from "fs";
import * as path from "path";
import { CsvWritableServiceWriteAppendResponse } from "../types/csv-writable-service.type";

export class CsvWritableService implements ICsvWritableService {

    async writeAppend(filePath: string, rows: string[][]): Promise<CsvWritableServiceWriteAppendResponse> {
        try {
            // Check if the file exists
            const fileExists = fs.existsSync(filePath);
    
            // If the file doesn't exist, create it and write the header if necessary
            if (!fileExists) {
                // Ensure the directory exists
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
    
                // Create the file (empty for now)
                fs.writeFileSync(filePath, '');
            }
    
            // Determine the maximum number of columns in the rows
            const maxColumns = rows.reduce((max, row) => Math.max(max, row.length), 0);
    
            // Process rows:
            // 1. Trim each cell
            // 2. Pad rows with fewer columns than the maximum
            // 3. Filter out rows with only empty cells
            const filteredRows = rows
                .map(row => {
                    // Trim each cell
                    const trimmedRow = row.map(cell => cell.trim());
    
                    // Pad the row with empty strings if it has fewer columns than the maximum
                    while (trimmedRow.length < maxColumns) {
                        trimmedRow.push('');
                    }
    
                    return trimmedRow;
                })
                .filter(row => row.some(cell => cell.length > 0)); // Keep rows with at least one non-empty cell
    
            // If there are no valid rows to write, return early
            if (filteredRows.length === 0) {
                return {
                    initialized: !fileExists,
                };
            }
    
            // Convert rows to CSV format
            const csvContent = filteredRows.map(row => row.join(',')).join('\n') + '\n';
    
            // Append the CSV content to the file
            fs.appendFileSync(filePath, csvContent);
    
            // Return the response indicating whether the file was initialized
            return {
                initialized: !fileExists,
            };
        } catch (error) {
            // Return the response with the error if something went wrong
            return {
                initialized: false,
                error: error instanceof Error ? error : new Error('An unknown error occurred'),
            };
        }
    }
}