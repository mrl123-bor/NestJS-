"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemInfoModule = void 0;
const common_1 = require("@nestjs/common");
const system_info_controller_1 = require("./system-info.controller");
const system_info_service_1 = require("./system-info.service");
let SystemInfoModule = class SystemInfoModule {
};
exports.SystemInfoModule = SystemInfoModule;
exports.SystemInfoModule = SystemInfoModule = __decorate([
    (0, common_1.Module)({
        controllers: [system_info_controller_1.SystemInfoController],
        providers: [system_info_service_1.SystemInfoService],
    })
], SystemInfoModule);
//# sourceMappingURL=system-info.module.js.map