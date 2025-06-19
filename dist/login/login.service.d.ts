import { ConfigService } from '@nestjs/config';
export declare class LoginService {
    private readonly configService;
    private readonly configPath;
    constructor(configService: ConfigService);
    validateUser(username: string, password: string): boolean;
    login(username: string, password: string): Promise<{
        code: number;
        token: string;
    }>;
    validateToken(token: string): Promise<boolean>;
    logout(token: string): Promise<{
        code: number;
        message: string;
    }>;
}
