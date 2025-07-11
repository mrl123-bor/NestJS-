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
exports.SyncTaskController = void 0;
const common_1 = require("@nestjs/common");
const sync_task_service_1 = require("./sync-task.service");
const auth_guard_1 = require("../auth/auth.guard");
const create_batch_sync_task_dto_1 = require("./create-batch-sync-task.dto");
let SyncTaskController = class SyncTaskController {
    constructor(syncTaskService) {
        this.syncTaskService = syncTaskService;
    }
    async createSyncTask(taskData) {
        return this.syncTaskService.createSyncTask(taskData);
    }
    async createBatchSyncTasks(batchTaskData) {
        return this.syncTaskService.createBatchSyncTasks(batchTaskData);
    }
    async getSyncTasks(page = 1, limit = 10, order = 'DESC') {
        return this.syncTaskService.getSyncTasks(page, limit, order);
    }
    async updateSyncTask(id, taskData) {
        return this.syncTaskService.updateSyncTask(id, taskData);
    }
    async startSyncTask(id) {
        return this.syncTaskService.startSyncTask(id);
    }
    async pauseSyncTask(id) {
        return this.syncTaskService.pauseSyncTask(id);
    }
    async clearSyncTaskLogs() {
        return this.syncTaskService.clearSyncTaskLogs();
    }
    async deleteBatchSyncTasks(ids) {
        return this.syncTaskService.deleteBatchSyncTasks(ids);
    }
    async updateBatchSyncTasks(ids, updateData) {
        return this.syncTaskService.updateBatchSyncTasks(ids, updateData);
    }
    async deleteSyncTask(id) {
        return this.syncTaskService.deleteSyncTask(id);
    }
    async getSyncTaskLogs(page = 1, limit = 10, taskId) {
        return this.syncTaskService.getSyncTaskLogs(page, limit, taskId);
    }
};
exports.SyncTaskController = SyncTaskController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "createSyncTask", null);
__decorate([
    (0, common_1.Post)('batch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_batch_sync_task_dto_1.CreateBatchSyncTaskDto]),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "createBatchSyncTasks", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "getSyncTasks", null);
__decorate([
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "updateSyncTask", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "startSyncTask", null);
__decorate([
    (0, common_1.Post)(':id/pause'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "pauseSyncTask", null);
__decorate([
    (0, common_1.Delete)('logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "clearSyncTaskLogs", null);
__decorate([
    (0, common_1.Delete)('batch'),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "deleteBatchSyncTasks", null);
__decorate([
    (0, common_1.Patch)('batch'),
    __param(0, (0, common_1.Body)('ids')),
    __param(1, (0, common_1.Body)('updateData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "updateBatchSyncTasks", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "deleteSyncTask", null);
__decorate([
    (0, common_1.Get)('logs'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], SyncTaskController.prototype, "getSyncTaskLogs", null);
exports.SyncTaskController = SyncTaskController = __decorate([
    (0, common_1.Controller)('sync-task'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [sync_task_service_1.SyncTaskService])
], SyncTaskController);
//# sourceMappingURL=sync-task.controller.js.map