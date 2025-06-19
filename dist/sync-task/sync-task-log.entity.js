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
exports.SyncTaskLogEntity = void 0;
const typeorm_1 = require("typeorm");
const sync_task_entity_1 = require("./sync-task.entity");
let SyncTaskLogEntity = class SyncTaskLogEntity {
};
exports.SyncTaskLogEntity = SyncTaskLogEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SyncTaskLogEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sync_task_entity_1.SyncTaskEntity),
    __metadata("design:type", sync_task_entity_1.SyncTaskEntity)
], SyncTaskLogEntity.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], SyncTaskLogEntity.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SyncTaskLogEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SyncTaskLogEntity.prototype, "sourceDatabase", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SyncTaskLogEntity.prototype, "targetDatabase", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SyncTaskLogEntity.prototype, "tableName", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], SyncTaskLogEntity.prototype, "fields", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], SyncTaskLogEntity.prototype, "syncTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SyncTaskLogEntity.prototype, "syncType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SyncTaskLogEntity.prototype, "success", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SyncTaskLogEntity.prototype, "errorMessage", void 0);
exports.SyncTaskLogEntity = SyncTaskLogEntity = __decorate([
    (0, typeorm_1.Entity)()
], SyncTaskLogEntity);
//# sourceMappingURL=sync-task-log.entity.js.map