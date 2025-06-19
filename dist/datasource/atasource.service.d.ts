import { Repository } from 'typeorm';
import { DataSourceEntity } from './datasource.entity';
import { SyncTaskEntity } from '../sync-task/sync-task.entity';
export declare class DataSourceService {
    private readonly dataSourceRepository;
    private readonly syncTaskRepository;
    constructor(dataSourceRepository: Repository<DataSourceEntity>, syncTaskRepository: Repository<SyncTaskEntity>);
    getDataSources(page?: number, limit?: number): Promise<{
        code: number;
        data: {
            items: DataSourceEntity[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createDataSource(data: Partial<DataSourceEntity>): Promise<{
        code: number;
        message: string;
    }>;
    checkDataSource(id: number): Promise<boolean>;
    updateDataSource(id: number, data: Partial<DataSourceEntity>): Promise<{
        code: number;
        message: string;
    }>;
    deleteDataSource(id: number): Promise<{
        code: number;
        message: string;
    }>;
    testConnection(data: Partial<DataSourceEntity>): Promise<{
        code: number;
        message: string;
    }>;
    getAllDataSources(): Promise<{
        code: number;
        data: DataSourceEntity[];
    }>;
    getTablesAndFields(id: number): Promise<{
        code: number;
        data: any[];
    }>;
}
