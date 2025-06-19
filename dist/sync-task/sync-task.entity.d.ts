import { DataSourceEntity } from '../datasource/datasource.entity';
export declare class SyncTaskEntity {
    id: number;
    sourceDatabase: DataSourceEntity;
    targetDatabase: DataSourceEntity;
    selectedTable: string;
    selectedFields: string[];
    isSyncEnabled: boolean;
    incrementalFields: string[];
    lastSyncValues: {
        values: Record<string, string>;
        timestamp: string;
    };
    isIncrementalSync: boolean;
    lastSyncTime: Date;
    executionTime: string;
    isExecuting: boolean;
}
