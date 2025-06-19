"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncTaskModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sync_task_controller_1 = require("./sync-task.controller");
const sync_task_service_1 = require("./sync-task.service");
const sync_task_entity_1 = require("./sync-task.entity");
const sync_task_log_entity_1 = require("./sync-task-log.entity");
const atasource_service_1 = require("../datasource/atasource.service");
const datasource_entity_1 = require("../datasource/datasource.entity");
const login_module_1 = require("../login/login.module");
let SyncTaskModule = class SyncTaskModule {
};
exports.SyncTaskModule = SyncTaskModule;
exports.SyncTaskModule = SyncTaskModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                sync_task_entity_1.SyncTaskEntity,
                datasource_entity_1.DataSourceEntity,
                sync_task_log_entity_1.SyncTaskLogEntity
            ]),
            login_module_1.LoginModule
        ],
        controllers: [sync_task_controller_1.SyncTaskController],
        providers: [sync_task_service_1.SyncTaskService, atasource_service_1.DataSourceService],
    })
], SyncTaskModule);
//# sourceMappingURL=sync-task.module.js.map