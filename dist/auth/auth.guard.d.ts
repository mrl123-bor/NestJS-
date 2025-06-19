import { CanActivate, ExecutionContext } from '@nestjs/common';
import { LoginService } from '../login/login.service';
export declare class AuthGuard implements CanActivate {
    private readonly loginService;
    constructor(loginService: LoginService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
