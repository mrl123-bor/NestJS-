"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const datasource_controller_1 = require("./datasource.controller");
const atasource_service_1 = require("./atasource.service");
const login_service_1 = require("../login/login.service");
const datasource_entity_1 = require("./datasource.entity");
const sync_task_entity_1 = require("../sync-task/sync-task.entity");
let DataSourceModule = class DataSourceModule {
};
exports.DataSourceModule = DataSourceModule;
exports.DataSourceModule = DataSourceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([datasource_entity_1.DataSourceEntity, sync_task_entity_1.SyncTaskEntity]),
        ],
        controllers: [datasource_controller_1.DataSourceController],
        providers: [atasource_service_1.DataSourceService, login_service_1.LoginService],
    })
], DataSourceModule);
//# sourceMappingURL=datasource.module.js.map