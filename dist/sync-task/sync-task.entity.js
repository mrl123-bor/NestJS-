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
exports.SyncTaskEntity = void 0;
const typeorm_1 = require("typeorm");
const datasource_entity_1 = require("../datasource/datasource.entity");
let SyncTaskEntity = class SyncTaskEntity {
};
exports.SyncTaskEntity = SyncTaskEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SyncTaskEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => datasource_entity_1.DataSourceEntity),
    __metadata("design:type", datasource_entity_1.DataSourceEntity)
], SyncTaskEntity.prototype, "sourceDatabase", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => datasource_entity_1.DataSourceEntity),
    __metadata("design:type", datasource_entity_1.DataSourceEntity)
], SyncTaskEntity.prototype, "targetDatabase", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SyncTaskEntity.prototype, "selectedTable", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], SyncTaskEntity.prototype, "selectedFields", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SyncTaskEntity.prototype, "isSyncEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SyncTaskEntity.prototype, "syncAllFieldsExceptUpdatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], SyncTaskEntity.prototype, "incrementalFields", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], SyncTaskEntity.prototype, "lastSyncValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SyncTaskEntity.prototype, "isIncrementalSync", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SyncTaskEntity.prototype, "lastSyncTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SyncTaskEntity.prototype, "executionTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SyncTaskEntity.prototype, "isExecuting", void 0);
exports.SyncTaskEntity = SyncTaskEntity = __decorate([
    (0, typeorm_1.Entity)()
], SyncTaskEntity);
//# sourceMappingURL=sync-task.entity.js.map