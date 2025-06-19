import { SystemInfoService } from './system-info.service';
export declare class SystemInfoController {
    private readonly systemInfoService;
    constructor(systemInfoService: SystemInfoService);
    getSystemInfo(): Promise<{
        usedMemory: string;
        usedCPU: string;
        memoryConfig: string;
    }>;
}
