import { CsvWritableService } from "./csv.writable.service";
import * as fs from "fs";
import * as path from "path";

// Mock the fs methods
jest.mock("fs", () => ({
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn(),
    appendFileSync: jest.fn(),
}));

describe("CsvWritableService", () => {
    let service: CsvWritableService;
    const mockFilePath = "testDir/testFile.csv";
    const mockRows = [
        ["name", "age"],
        ["John", "30"]
    ];

    beforeEach(() => {
        service = new CsvWritableService();
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it("should return initialized as false when the file already exists", async () => {
        // Mocking fs.existsSync to return true, indicating the file exists
        (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

        const response = await service.writeAppend(mockFilePath, mockRows);

        expect(response.initialized).toBe(false);
        expect(fs.mkdirSync).not.toHaveBeenCalled();
        expect(fs.writeFileSync).not.toHaveBeenCalled();
        expect(fs.appendFileSync).toHaveBeenCalledWith(mockFilePath, "name,age\nJohn,30\n");
    });

    it("should return initialized as true when the file is created", async () => {
        // Mocking fs.existsSync to return false, indicating the file does not exist
        (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

        const response = await service.writeAppend(mockFilePath, mockRows);

        expect(response.initialized).toBe(true);
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(mockFilePath), { recursive: true });
        expect(fs.writeFileSync).toHaveBeenCalledWith(mockFilePath, "");
        expect(fs.appendFileSync).toHaveBeenCalledWith(mockFilePath, "name,age\nJohn,30\n");
    });

    it("should handle errors correctly", async () => {
        // Mocking fs.existsSync to return false, indicating the file does not exist
        (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
        // Mocking fs.appendFileSync to throw an error
        (fs.appendFileSync as jest.Mock).mockImplementationOnce(() => {
            throw new Error("Error appending to file");
        });

        const response = await service.writeAppend(mockFilePath, mockRows);

        expect(response.error).toBeDefined();
        expect(response.error?.message).toBe("Error appending to file");
    });

    it("should handle empty rows ([[]]) without crashing and still create the file if needed", async () => {
        // Mocking fs.existsSync to return false, indicating the file does not exist
        (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

        const response = await service.writeAppend(mockFilePath, [[]]);

        expect(response.initialized).toBe(true);
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(mockFilePath), { recursive: true });
        expect(fs.writeFileSync).toHaveBeenCalledWith(mockFilePath, "");
    });
});