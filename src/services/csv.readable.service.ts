import * as fs from "fs";
import * as path from "path";
import { ICsvReadableService } from "../interfaces/services/i.csv.readable.service";

export class CsvReadableService implements ICsvReadableService {
    constructor() {}
    
    async read<E extends Error>(filePath: string): Promise<string | E> {
        const fileExtension = path.extname(filePath);

        // Check if the file is a CSV file
        if (fileExtension !== '.csv') {
            // Return a custom error if the file is not a CSV
            return new Error("The file is not a CSV file.") as E;
        }

        try {
            // Read the file asynchronously
            const data = await fs.promises.readFile(filePath, { encoding: "utf8" });
            return data; // Return the CSV content as a string
        } catch (error) {
            // Return any other errors that occur during file reading
            return new Error(`Error reading the file: ${(error as any).message}`) as E;
        }
    }
}
