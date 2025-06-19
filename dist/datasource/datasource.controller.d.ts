import { DataSourceService } from './atasource.service';
export declare class DataSourceController {
    private readonly dataSourceService;
    constructor(dataSourceService: DataSourceService);
    getDataSources(page?: number, limit?: number): Promise<{
        code: number;
        data: {
            items: import("./datasource.entity").DataSourceEntity[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    testConnection(data: any): Promise<{
        code: number;
        message: string;
    }>;
    createDataSource(data: any): Promise<{
        code: number;
        message: string;
    }>;
    updateDataSource(id: string, data: any): Promise<{
        code: number;
        message: string;
    }>;
    deleteDataSource(id: string): Promise<{
        code: number;
        message: string;
    }>;
    getAllDataSources(): Promise<{
        code: number;
        data: import("./datasource.entity").DataSourceEntity[];
    }>;
    getTablesAndFields(id: string): Promise<{
        code: number;
        data: any[];
    }>;
}
