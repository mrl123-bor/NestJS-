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
exports.DataSourceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const datasource_entity_1 = require("./datasource.entity");
const promise_1 = require("mysql2/promise");
const pg_1 = require("pg");
const sync_task_entity_1 = require("../sync-task/sync-task.entity");
let DataSourceService = class DataSourceService {
    constructor(dataSourceRepository, syncTaskRepository) {
        this.dataSourceRepository = dataSourceRepository;
        this.syncTaskRepository = syncTaskRepository;
    }
    async getDataSources(page = 1, limit = 10) {
        const [data, total] = await this.dataSourceRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                id: 'DESC'
            }
        });
        return {
            code: 200,
            data: {
                items: data,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createDataSource(data) {
        const newDataSource = this.dataSourceRepository.create(data);
        await this.dataSourceRepository.save(newDataSource);
        return {
            code: 200,
            message: '数据源创建成功'
        };
    }
    async checkDataSource(id) {
        const count = await this.syncTaskRepository.count({
            where: [
                { sourceDatabase: { id } },
                { targetDatabase: { id } }
            ]
        });
        return count > 0;
    }
    async updateDataSource(id, data) {
        await this.dataSourceRepository.update(id, data);
        return {
            code: 200,
            message: '数据源更新成功'
        };
    }
    async deleteDataSource(id) {
        const isAssociated = await this.checkDataSource(id);
        if (isAssociated) {
            return {
                code: 500,
                message: '该数据源有关联的同步任务，不能删除'
            };
        }
        await this.dataSourceRepository.delete(id);
        return {
            code: 200,
            message: '数据源删除成功'
        };
    }
    async testConnection(data) {
        try {
            let pool;
            if (data.type === 'mysql') {
                pool = (0, promise_1.createPool)({
                    host: data.address,
                    port: parseInt(data.port),
                    user: data.username,
                    password: data.password,
                    database: data.database || 'mysql',
                    connectionLimit: 1,
                    connectTimeout: 3000
                });
            }
            else if (data.type === 'postgres') {
                pool = new pg_1.Pool({
                    host: data.address,
                    port: parseInt(data.port),
                    user: data.username,
                    password: data.password,
                    database: data.database || 'postgres',
                    connectionTimeoutMillis: 3000
                });
            }
            else {
                throw new Error('不支持的数据库类型');
            }
            const conn = await pool.getConnection();
            await conn.release();
            await pool.end();
            return {
                code: 200,
                message: '连接成功'
            };
        }
        catch (error) {
            return {
                code: 500,
                message: `连接失败: ${error.message}`
            };
        }
    }
    async getAllDataSources() {
        const data = await this.dataSourceRepository.find({
            order: {
                id: 'DESC'
            },
            select: ['id', 'name']
        });
        return {
            code: 200,
            data
        };
    }
    async getTablesAndFields(id) {
        const dataSource = await this.dataSourceRepository.findOne({ where: { id } });
        if (!dataSource) {
            throw new Error('数据源不存在');
        }
        let tables = [];
        if (dataSource.type === 'mysql') {
            const conn = await (0, promise_1.createConnection)({
                host: dataSource.address,
                port: parseInt(dataSource.port),
                user: dataSource.username,
                password: dataSource.password,
                database: dataSource.database || 'mysql'
            });
            const [tableResults] = await conn.query('SHOW TABLES');
            tables = await Promise.all(tableResults.map(async (table) => {
                const tableName = table[`Tables_in_${dataSource.database}`];
                const [fields] = await conn.query(`DESCRIBE ${tableName}`);
                return {
                    tableName,
                    fields: fields.map((f) => ({
                        name: f.Field,
                        type: f.Type,
                        isNullable: f.Null === 'YES',
                        key: f.Key,
                        default: f.Default,
                        extra: f.Extra
                    }))
                };
            }));
            await conn.end();
        }
        else if (dataSource.type === 'postgres') {
            const pool = new pg_1.Pool({
                host: dataSource.address,
                port: parseInt(dataSource.port),
                user: dataSource.username,
                password: dataSource.password,
                database: dataSource.database || 'postgres'
            });
            const client = await pool.connect();
            try {
                const tableResults = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
                tables = await Promise.all(tableResults.rows.map(async (table) => {
                    const fields = await client.query(`SELECT column_name, data_type, is_nullable, column_default 
           FROM information_schema.columns 
           WHERE table_name = $1`, [table.table_name]);
                    return {
                        tableName: table.table_name,
                        fields: fields.rows.map(f => ({
                            name: f.column_name,
                            type: f.data_type,
                            isNullable: f.is_nullable === 'YES',
                            default: f.column_default
                        }))
                    };
                }));
            }
            finally {
                client.release();
                await pool.end();
            }
        }
        return {
            code: 200,
            data: tables
        };
    }
};
exports.DataSourceService = DataSourceService;
exports.DataSourceService = DataSourceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(datasource_entity_1.DataSourceEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(sync_task_entity_1.SyncTaskEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DataSourceService);
//# sourceMappingURL=atasource.service.js.map