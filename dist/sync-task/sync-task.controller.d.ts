import { SyncTaskService } from './sync-task.service';
import { CreateBatchSyncTaskDto } from './create-batch-sync-task.dto';
export declare class SyncTaskController {
    private readonly syncTaskService;
    constructor(syncTaskService: SyncTaskService);
    createSyncTask(taskData: any): Promise<{
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
    getSyncTasks(page?: number, limit?: number, order?: 'ASC' | 'DESC'): Promise<{
        code: number;
        data: {
            items: {
                sourceDatabase: import("./sync-task.entity").SyncTaskEntity["sourceDatabase"];
                targetDatabase: import("./sync-task.entity").SyncTaskEntity["targetDatabase"];
                tasks: import("./sync-task.entity").SyncTaskEntity[];
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateSyncTask(id: number, taskData: any): Promise<{
        code: number;
        message: string;
    }>;
    startSyncTask(id: number): Promise<{
        code: number;
        message: string;
    }>;
    pauseSyncTask(id: number): Promise<{
        code: number;
        message: string;
    }>;
    clearSyncTaskLogs(): Promise<{
        code: number;
        message: string;
        data: {
            deletedCount: number;
            remainingCount: number;
        };
    }>;
    deleteSyncTask(id: number): Promise<{
        code: number;
        message: string;
        affected: number;
    }>;
    getSyncTaskLogs(page?: number, limit?: number, taskId?: number): Promise<{
        code: number;
        data: {
            items: {
                syncTime: string;
                id: number;
                task: import("./sync-task.entity").SyncTaskEntity;
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
}
