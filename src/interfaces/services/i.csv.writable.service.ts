import { CsvWritableServiceWriteAppendResponse } from "../../types/csv-writable-service.type";

export interface ICsvWritableService {
    writeAppend: (filePath: string, rows: string[][]) => Promise<CsvWritableServiceWriteAppendResponse>;
}