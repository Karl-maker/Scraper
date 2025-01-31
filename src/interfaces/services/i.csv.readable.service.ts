export interface ICsvReadableService {
    read: <E extends Error>(filePath: string) => Promise<string | E>;
}