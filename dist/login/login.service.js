"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
let LoginService = class LoginService {
    constructor(configService) {
        this.configService = configService;
        this.configPath = path.join(__dirname, '..', '..', 'conf.yml');
    }
    validateUser(username, password) {
        const validUsername = this.configService.get('auth.username');
        const validPassword = this.configService.get('auth.password');
        return username === validUsername && password === validPassword;
    }
    async login(username, password) {
        if (this.validateUser(username, password)) {
            const token = (0, uuid_1.v4)();
            const lastActivity = new Date().toISOString();
            const configFile = await fs.readFile(this.configPath, 'utf8');
            const config = yaml.load(configFile);
            config.token = token;
            config.lastActivity = lastActivity;
            await fs.writeFile(this.configPath, yaml.dump(config));
            return {
                code: 200,
                token
            };
        }
        throw new Error('用户名或密码错误');
    }
    async validateToken(token) {
        const configFile = await fs.readFile(this.configPath, 'utf8');
        const config = yaml.load(configFile);
        if (config.token !== token) {
            return false;
        }
        const lastActivity = new Date(config.lastActivity);
        const now = new Date();
        const diff = (now.getTime() - lastActivity.getTime()) / 1000 / 60;
        if (diff > 20) {
            config.token = '';
            config.lastActivity = '';
            await fs.writeFile(this.configPath, yaml.dump(config));
            return false;
        }
        config.lastActivity = now.toISOString();
        await fs.writeFile(this.configPath, yaml.dump(config));
        return true;
    }
    async logout(token) {
        const configFile = await fs.readFile(this.configPath, 'utf8');
        const config = yaml.load(configFile);
        if (config.token === token) {
            config.token = '';
            config.lastActivity = '';
            await fs.writeFile(this.configPath, yaml.dump(config));
            return { code: 200, message: '退出登录成功' };
        }
        return { code: 401, message: '无效的 token' };
    }
};
exports.LoginService = LoginService;
exports.LoginService = LoginService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoginService);
//# sourceMappingURL=login.service.js.map