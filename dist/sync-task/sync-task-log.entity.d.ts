import { SyncTaskEntity } from './sync-task.entity';
export declare class SyncTaskLogEntity {
    id: number;
    task: SyncTaskEntity;
    data: string;
    content: string;
    sourceDatabase: string;
    targetDatabase: string;
    tableName: string;
    fields: string[];
    syncTime: Date;
    syncType: 'incremental' | 'full';
    success: boolean;
    errorMessage?: string;
}
