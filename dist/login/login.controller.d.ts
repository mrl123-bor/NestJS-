import { LoginService } from './login.service';
export declare class LoginController {
    private readonly loginService;
    constructor(loginService: LoginService);
    login(username: string, password: string): Promise<{
        code: number;
        token: string;
    }>;
    validateToken(token: string): Promise<{
        valid: boolean;
    }>;
    logout(authHeader: string): Promise<{
        code: number;
        message: string;
    }>;
}
