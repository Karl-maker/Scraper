import { HoaPersistenceCsv } from './hoa.persistence.csv';
import { ICsvWritableService } from '../interfaces/services/i.csv.writable.service';
import { IssuePersistingError } from '../utils/error/issue.persisting.error';
import { Hoa } from '../entities/hoa.entity';
import { CsvWritableService } from '../services/csv.writable.service';
import { ICsvReadableService } from '../interfaces/services/i.csv.readable.service';

jest.mock('../interfaces/services/i.csv.writable.service'); // Mocking ICsvWritableService

describe('HoaPersistenceCsv', () => {
    let hoaPersistence: HoaPersistenceCsv;
    let mockWriteService: ICsvWritableService;
    let mockReadService: ICsvReadableService;

    beforeEach(() => {
        // Properly mock ICsvWritableService and its methods
        mockWriteService = {
            writeAppend: jest.fn(),
        } as any; // Typecast because ICsvWritableService is an interface

        mockReadService = {
            read: jest.fn(),
        } as any; // Typecast because ICsvWritableService is an interface

        hoaPersistence = new HoaPersistenceCsv('/path/to/file.csv', mockWriteService, mockReadService);
    });

    describe('save', () => {
        it('should save HOAs and add header if file is initialized', async () => {
            // Arrange
            const hoas: Hoa[] = [
                { id: '1', name: 'Hoa 1', mailing_address: '123 St', agent_name: 'Agent 1', status: 'active', formed_in: '2023-01-01' },
                { id: '2', name: 'Hoa 2', mailing_address: '456 Ave', agent_name: 'Agent 2', status: 'active', formed_in: '2022-05-01' }
            ];

            // Simulate that the directory does not exist and needs initialization
            (mockWriteService.writeAppend as any).mockResolvedValueOnce({ initialized: true });
            (mockWriteService.writeAppend as any).mockResolvedValueOnce({ initialized: false }); // Simulate appending HOAs
            (mockReadService.read as any).mockResolvedValueOnce('');

            // Act
            const result = await hoaPersistence.save(hoas);

            // Assert
            expect(result).toEqual(hoas);
            expect(mockWriteService.writeAppend).toHaveBeenCalledWith('/path/to/file.csv', [[]]);
            expect(mockWriteService.writeAppend).toHaveBeenCalledWith('/path/to/file.csv', [
                ['ID', 'Name', 'Email', 'Address', 'Agent Name', 'Status', 'Location']
            ]);
            expect(mockWriteService.writeAppend).toHaveBeenCalledWith('/path/to/file.csv', expect.arrayContaining([
                expect.arrayContaining(['1', 'Hoa 1', '123 St', 'Agent 1', 'active', '2023-01-01']),
                expect.arrayContaining(['2', 'Hoa 2', '456 Ave', 'Agent 2', 'active', '2022-05-01']),
            ]));
        });

        it('should return an error if writeAppend fails', async () => {
            // Arrange
            const hoas: Hoa[] = [
                { id: '1', name: 'Hoa 1', mailing_address: '123 St', agent_name: 'Agent 1', status: 'active', formed_in: '2023-01-01' }
            ];

            // Simulate a writeAppend failure
            (mockWriteService.writeAppend as any).mockResolvedValueOnce({ error: new Error('File write error'), initialized: false });

            // Act
            const result = await hoaPersistence.save(hoas);

            // Assert
            expect(result).toBeInstanceOf(Error);
            expect(mockWriteService.writeAppend).toHaveBeenCalledTimes(1); // Only the first writeAppend should have been called
        });

        it('should not add a header if the file already exists', async () => {
            // Arrange
            const hoas: Hoa[] = [
                { id: '1', name: 'Hoa 1', mailing_address: '123 St', agent_name: 'Agent 1', status: 'active', formed_in: '2023-01-01' }
            ];

            // Simulate that the file already exists and does not need initialization
            (mockWriteService.writeAppend as any).mockResolvedValueOnce({ initialized: false });
            (mockWriteService.writeAppend as any).mockResolvedValueOnce({ initialized: false });
            (mockReadService.read as any).mockResolvedValueOnce('');
            // Act
            const result = await hoaPersistence.save(hoas);

            // Assert
            expect(result).toEqual(hoas);
            expect(mockWriteService.writeAppend).toHaveBeenCalledWith('/path/to/file.csv', [[]]);
            expect(mockWriteService.writeAppend).not.toHaveBeenCalledWith('/path/to/file.csv', [
                ['ID', 'Name', 'Email', 'Address', 'Agent Name', 'Status', 'Started']
            ]);
            expect(mockWriteService.writeAppend).toHaveBeenCalledWith('/path/to/file.csv', expect.arrayContaining([
                expect.arrayContaining(['1', 'Hoa 1', '123 St', 'Agent 1', 'active', '2023-01-01']),
            ]));
        });
    });

    describe('mapHoaToCsv', () => {
        it('should map HOA objects to CSV format correctly', () => {
            // Arrange
            const hoas: Hoa[] = [
                { id: '1', name: 'Hoa 1', mailing_address: '123 St', agent_name: 'Agent 1', status: 'active', formed_in: '2023-01-01' },
                { id: '2', name: 'Hoa 2', mailing_address: '456 Ave', agent_name: undefined, status: 'active', formed_in: '2022-05-01' }
            ];

            // Act
            const result = hoaPersistence.mapHoaToCsv(hoas);

            // Assert
            expect(result).toEqual([
                ['1', 'Hoa 1', "UNAVAILABLE", '123 St', 'Agent 1', 'active', '2023-01-01'],
                ['2', 'Hoa 2', "UNAVAILABLE", '456 Ave', 'UNAVAILABLE', 'active', '2022-05-01']
            ]);
        });
    });

    describe('removeDuplicates', () => {
        let hoaPersistence: HoaPersistenceCsv;
        let mockReadService: ICsvReadableService;
    
        beforeEach(() => {
            mockReadService = {
                read: jest.fn(),
            } as any;
    
            hoaPersistence = new HoaPersistenceCsv('/path/to/file.csv', {} as any, mockReadService);
        });
    
        it('should return all HOAs if there is an error reading the file', async () => {
            // Arrange
            const hoas: Hoa[] = [
                { id: '1', name: 'Hoa 1', mailing_address: '123 St', agent_name: 'Agent 1', status: 'active', formed_in: '2023-01-01' },
                { id: '2', name: 'Hoa 2', mailing_address: '456 Ave', agent_name: 'Agent 2', status: 'active', formed_in: '2022-05-01' }
            ];
    
            (mockReadService.read as jest.Mock).mockResolvedValueOnce(new Error('File read error'));
    
            // Act
            const result = await hoaPersistence.removeDuplicates(hoas);
    
            // Assert
            expect(result).toEqual(hoas);
        });
    
        it('should return only unique HOAs that are not in the existing file', async () => {
            // Arrange
            const hoas: Hoa[] = [
                { id: '1', name: 'Hoa 1', mailing_address: '123 St', agent_name: 'Agent 1', status: 'active', formed_in: '2023-01-01' },
                { id: '2', name: 'Hoa 2', mailing_address: '456 Ave', agent_name: 'Agent 2', status: 'active', formed_in: '2022-05-01' },
                { id: '3', name: 'Hoa 3', mailing_address: '789 Blvd', agent_name: 'Agent 3', status: 'active', formed_in: '2021-09-15' }
            ];
    
            const fileData = '\nID,Name,Email,Address,Agent Name,Status,Location\n1,Hoa 1,123 St,Agent 1,active,2023-01-01\n2,Hoa 2,456 Ave,Agent 2,active,2022-05-01';
            (mockReadService.read as jest.Mock).mockResolvedValueOnce(fileData);
    
            // Act
            const result = await hoaPersistence.removeDuplicates(hoas);
    
            // Assert
            expect(result).toEqual([
                { id: '3', name: 'Hoa 3', mailing_address: '789 Blvd', agent_name: 'Agent 3', status: 'active', formed_in: '2021-09-15' }
            ]);
        });
    
        it('should return all HOAs if the file is empty', async () => {
            // Arrange
            const hoas: Hoa[] = [
                { id: '1', name: 'Hoa 1', mailing_address: '123 St', agent_name: 'Agent 1', status: 'active', formed_in: '2023-01-01' },
                { id: '2', name: 'Hoa 2', mailing_address: '456 Ave', agent_name: 'Agent 2', status: 'active', formed_in: '2022-05-01' }
            ];
    
            (mockReadService.read as jest.Mock).mockResolvedValueOnce('');
    
            // Act
            const result = await hoaPersistence.removeDuplicates(hoas);
    
            // Assert
            expect(result).toEqual(hoas);
        });
    });
});
