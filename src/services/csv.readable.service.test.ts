import { CsvReadableService } from "./csv.readable.service"; // Adjust the path as needed
import * as fs from "fs";
import * as path from "path";
import { ICsvReadableService } from "../interfaces/services/i.csv.readable.service";

// Mocking fs.promises.readFile to simulate file reading behavior
jest.mock("fs", () => ({
    promises: {
        readFile: jest.fn()
    }
}));

describe('CsvReadableService', () => {
    let csvReadableService: CsvReadableService;

    beforeEach(() => {
        csvReadableService = new CsvReadableService();
    });

    it('should return file content if the file is a CSV', async () => {
        const filePath = 'path/to/file.csv';
        const mockFileContent = 'header1,header2\nrow1col1,row1col2';

        // Mocking readFile to return file content
        (fs.promises.readFile as jest.Mock).mockResolvedValue(mockFileContent);

        const result = await csvReadableService.read(filePath);

        expect(result).toBe(mockFileContent);
        expect(fs.promises.readFile).toHaveBeenCalledWith(filePath, { encoding: "utf8" });
    });

    it('should return an error if the file is not a CSV', async () => {
        const filePath = 'path/to/file.txt';

        const result = await csvReadableService.read(filePath);

        expect(result).toBeInstanceOf(Error);
        expect((result as Error).message).toBe('The file is not a CSV file.');
    });

    it('should return an error if there is an issue reading the file', async () => {
        const filePath = 'path/to/file.csv';
        const readFileError = new Error('File not found');

        // Mocking readFile to throw an error
        (fs.promises.readFile as jest.Mock).mockRejectedValue(readFileError);

        const result = await csvReadableService.read(filePath);

        expect(result).toBeInstanceOf(Error);
        expect((result as Error).message).toBe(`Error reading the file: ${readFileError.message}`);
    });
});
