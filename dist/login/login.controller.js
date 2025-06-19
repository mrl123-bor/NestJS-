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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const login_service_1 = require("./login.service");
let LoginController = class LoginController {
    constructor(loginService) {
        this.loginService = loginService;
    }
    async login(username, password) {
        return this.loginService.login(username, password);
    }
    async validateToken(token) {
        if (!token) {
            return { valid: false };
        }
        const valid = await this.loginService.validateToken(token.replace('Bearer ', ''));
        return { valid };
    }
    async logout(authHeader) {
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            return { code: 400, message: '缺少 token' };
        }
        return this.loginService.logout(token);
    }
};
exports.LoginController = LoginController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('username')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('validate'),
    __param(0, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "validateToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "logout", null);
exports.LoginController = LoginController = __decorate([
    (0, common_1.Controller)('login'),
    __metadata("design:paramtypes", [login_service_1.LoginService])
], LoginController);
//# sourceMappingURL=login.controller.js.map