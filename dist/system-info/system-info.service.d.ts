export declare class SystemInfoService {
    getSystemInfo(): Promise<{
        usedMemory: string;
        usedCPU: string;
        memoryConfig: string;
    }>;
}
