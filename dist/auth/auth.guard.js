"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const login_service_1 = require("../login/login.service");
let AuthGuard = class AuthGuard {
    constructor(loginService) {
        this.loginService = loginService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        console.log(`AuthGuard拦截请求: ${request.method} ${request.url}`);
        const response = context.switchToHttp().getResponse();
        const token = request.headers['authorization']?.replace('Bearer ', '');
        console.log('Token:', token);
        if (!token) {
            response.status(common_1.HttpStatus.OK).json({ code: 401 });
            return false;
        }
        const isValid = await this.loginService.validateToken(token);
        console.log('isValid:', isValid);
        if (!isValid) {
            response.status(common_1.HttpStatus.OK).json({ code: 401 });
            return false;
        }
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [login_service_1.LoginService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map