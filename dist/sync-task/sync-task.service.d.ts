import { OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { SyncTaskEntity } from './sync-task.entity';
import { DataSourceService } from '../datasource/atasource.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SyncTaskLogEntity } from './sync-task-log.entity';
import { CreateBatchSyncTaskDto } from './create-batch-sync-task.dto';
export declare class SyncTaskService implements OnModuleInit {
    private readonly syncTaskRepository;
    private readonly syncTaskLogRepository;
    private readonly dataSourceService;
    private readonly dataSource;
    private readonly schedulerRegistry;
    private readonly logger;
    constructor(syncTaskRepository: Repository<SyncTaskEntity>, syncTaskLogRepository: Repository<SyncTaskLogEntity>, dataSourceService: DataSourceService, dataSource: DataSource, schedulerRegistry: SchedulerRegistry);
    onModuleInit(): Promise<void>;
    private addCronJob;
    private removeCronJob;
    createSyncTask(taskData: Partial<SyncTaskEntity>): Promise<{
        code: number;
        message: string;
    }>;
    getSyncTasks(page?: number, limit?: number, order?: 'ASC' | 'DESC'): Promise<{
        code: number;
        data: {
            items: {
                sourceDatabase: SyncTaskEntity["sourceDatabase"];
                targetDatabase: SyncTaskEntity["targetDatabase"];
                tasks: SyncTaskEntity[];
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    private validateCronExpression;
    updateSyncTask(id: number, taskData: Partial<SyncTaskEntity>): Promise<{
        code: number;
        message: string;
    }>;
    deleteSyncTask(id: number): Promise<{
        code: number;
        message: string;
        affected: number;
    }>;
    syncData(task: SyncTaskEntity): Promise<void>;
    getPrimaryKey(connection: any, dbType: string, tableName: string): Promise<string | null>;
    ensureUpdatedAtFieldExists(connection: any, dbType: string, table: string): Promise<boolean>;
    checkTableExists(connection: any, dbType: string, table: string, database?: string): Promise<any>;
    createTable(sourceConnection: any, targetConnection: any, sourceType: string, targetType: string, table: string, fields: string[]): Promise<void>;
    fullSync(sourceConnection: any, targetConnection: any, sourceType: string, targetType: string, table: string, fields: string[]): Promise<any>;
    escapeField(dbType: string, field: string): string;
    escapeTable(dbType: string, tableName: string): string;
    updateRecord(connection: any, dbType: string, table: string, fields: string[], primaryKey: string, row: any): Promise<number>;
    insertRecord(connection: any, dbType: string, table: string, fields: string[], row: any): Promise<number>;
    incrementalSync(sourceConnection: any, targetConnection: any, sourceType: string, targetType: string, table: string, fields: string[], task: SyncTaskEntity, primaryKey: string): Promise<{
        totalFetched: number;
        changesApplied: number;
        newLastSyncValues: {
            values: {
                updated_at: Date;
            };
            timestamp: string;
        };
        rows?: undefined;
    } | {
        totalFetched: any;
        changesApplied: number;
        newLastSyncValues: {
            values: {
                updated_at: string;
            };
            timestamp: string;
        };
        rows: any;
    }>;
    private logSyncTask;
    private formatDateTime;
    getSyncTaskLogs(page?: number, limit?: number, taskId?: number): Promise<{
        code: number;
        data: {
            items: {
                syncTime: string;
                id: number;
                task: SyncTaskEntity;
                data: string;
                content: string;
                sourceDatabase: string;
                targetDatabase: string;
                tableName: string;
                fields: string[];
                syncType: "incremental" | "full";
                success: boolean;
                errorMessage?: string;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    clearSyncTaskLogs(): Promise<{
        code: number;
        message: string;
        data: {
            deletedCount: number;
            remainingCount: number;
        };
    }>;
    startSyncTask(id: number): Promise<{
        code: number;
        message: string;
    }>;
    pauseSyncTask(id: number): Promise<{
        code: number;
        message: string;
    }>;
    createBatchSyncTasks(batchTaskData: CreateBatchSyncTaskDto): Promise<{
        code: number;
        message: string;
        data: {
            total: number;
            created: number;
            existing: number;
            failed: number;
            createdTasks: any[];
            existingTasks: any[];
            failedTasks: any[];
        };
    }>;
    deleteBatchSyncTasks(ids: number[]): Promise<{
        code: number;
        message: string;
    }>;
    updateBatchSyncTasks(ids: number[], updateData: Partial<SyncTaskEntity>): Promise<{
        code: number;
        message: string;
    }>;
}
