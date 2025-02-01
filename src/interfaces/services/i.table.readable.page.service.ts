export interface TableReadablePage {
    getTableDataById(id: string): Promise<string[][]>;
    getTableDataBySelector(selector: string, skipCount?: number): Promise<string[][]>;
    getTableByFirstTrTagSelector(selector: string): Promise<string[][]>;
}