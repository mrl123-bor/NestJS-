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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const login_module_1 = require("./login/login.module");
const datasource_module_1 = require("./datasource/datasource.module");
const image_module_1 = require("./image/image.module");
const system_info_module_1 = require("./system-info/system-info.module");
const typeorm_1 = require("@nestjs/typeorm");
const sync_task_module_1 = require("./sync-task/sync-task.module");
const schedule_1 = require("@nestjs/schedule");
const YAML_CONFIG_FILENAME = 'conf.yml';
const loadYamlConfig = () => {
    try {
        const filePath = path.join(__dirname, '..', YAML_CONFIG_FILENAME);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const config = yaml.load(fileContent);
        if (typeof config !== 'object' || config === null) {
            throw new Error('Loaded YAML config is not an object');
        }
        return config;
    }
    catch (error) {
        console.error('Failed to load YAML config:', error);
        return {};
    }
};
let AppModule = class AppModule {
    constructor(configService) {
        this.configService = configService;
        const authUsername = this.configService.get('auth.username');
        const authPassword = this.configService.get('auth.password');
        console.log('Auth username:', authUsername);
        console.log('Auth password:', authPassword);
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'datasources.db',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            config_1.ConfigModule.forRoot({
                load: [loadYamlConfig],
                isGlobal: true,
            }),
            login_module_1.LoginModule,
            datasource_module_1.DataSourceModule,
            image_module_1.ImageModule,
            system_info_module_1.SystemInfoModule,
            sync_task_module_1.SyncTaskModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppModule);
//# sourceMappingURL=app.module.js.map