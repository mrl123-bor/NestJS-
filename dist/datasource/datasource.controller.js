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
exports.DataSourceController = void 0;
const common_1 = require("@nestjs/common");
const atasource_service_1 = require("./atasource.service");
const auth_guard_1 = require("../auth/auth.guard");
let DataSourceController = class DataSourceController {
    constructor(dataSourceService) {
        this.dataSourceService = dataSourceService;
    }
    async getDataSources(page = 1, limit = 10) {
        return this.dataSourceService.getDataSources(page, limit);
    }
    async testConnection(data) {
        return this.dataSourceService.testConnection(data);
    }
    async createDataSource(data) {
        return this.dataSourceService.createDataSource(data);
    }
    async updateDataSource(id, data) {
        return this.dataSourceService.updateDataSource(Number(id), data);
    }
    async deleteDataSource(id) {
        return this.dataSourceService.deleteDataSource(Number(id));
    }
    async getAllDataSources() {
        return this.dataSourceService.getAllDataSources();
    }
    async getTablesAndFields(id) {
        return this.dataSourceService.getTablesAndFields(Number(id));
    }
};
exports.DataSourceController = DataSourceController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DataSourceController.prototype, "getDataSources", null);
__decorate([
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataSourceController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataSourceController.prototype, "createDataSource", null);
__decorate([
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DataSourceController.prototype, "updateDataSource", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DataSourceController.prototype, "deleteDataSource", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataSourceController.prototype, "getAllDataSources", null);
__decorate([
    (0, common_1.Get)('tables/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DataSourceController.prototype, "getTablesAndFields", null);
exports.DataSourceController = DataSourceController = __decorate([
    (0, common_1.Controller)('datasource'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [atasource_service_1.DataSourceService])
], DataSourceController);
//# sourceMappingURL=datasource.controller.js.map