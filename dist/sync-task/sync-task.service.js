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
var SyncTaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncTaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sync_task_entity_1 = require("./sync-task.entity");
const atasource_service_1 = require("../datasource/atasource.service");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const sync_task_log_entity_1 = require("./sync-task-log.entity");
const promise_1 = require("mysql2/promise");
const pg_1 = require("pg");
let SyncTaskService = SyncTaskService_1 = class SyncTaskService {
    constructor(syncTaskRepository, syncTaskLogRepository, dataSourceService, dataSource, schedulerRegistry) {
        this.syncTaskRepository = syncTaskRepository;
        this.syncTaskLogRepository = syncTaskLogRepository;
        this.dataSourceService = dataSourceService;
        this.dataSource = dataSource;
        this.schedulerRegistry = schedulerRegistry;
        this.logger = new common_1.Logger(SyncTaskService_1.name);
    }
    async onModuleInit() {
        const tasks = await this.syncTaskRepository.find({
            where: { isSyncEnabled: true },
            relations: ['sourceDatabase', 'targetDatabase'],
        });
        tasks.forEach(task => {
            if (task.executionTime) {
                this.addCronJob(task);
            }
        });
    }
    addCronJob(task) {
        const job = new cron_1.CronJob(task.executionTime, async () => {
            const updatedTask = await this.syncTaskRepository.findOne({ where: { id: task.id } });
            if (!updatedTask || !updatedTask.isExecuting) {
                this.logger.log(`任务 ${task.id} 已暂停，跳过执行`);
                return;
            }
            try {
                await this.syncData(task);
            }
            catch (error) {
                this.logger.error(`执行同步任务 ${task.id} 失败: ${error.message}`, error.stack);
                await this.logSyncTask(task, task.isIncrementalSync ? 'incremental' : 'full', false, error.message);
            }
        });
        this.schedulerRegistry.addCronJob(`syncTask-${task.id}`, job);
        job.start();
    }
    removeCronJob(taskId) {
        const jobName = `syncTask-${taskId}`;
        if (this.schedulerRegistry.doesExist('cron', jobName)) {
            try {
                this.schedulerRegistry.deleteCronJob(jobName);
                this.logger.log(`成功移除定时任务: ${jobName}`);
            }
            catch (error) {
                this.logger.error(`移除定时任务 ${jobName} 失败: ${error.message}`, error.stack);
            }
        }
    }
    async createSyncTask(taskData) {
        if (taskData.executionTime && !this.validateCronExpression(taskData.executionTime)) {
            throw new Error('无效的 cron 表达式');
        }
        if (taskData.isIncrementalSync && !taskData.lastSyncTime) {
            taskData.lastSyncTime = new Date();
        }
        const newTask = this.syncTaskRepository.create(taskData);
        await this.syncTaskRepository.save(newTask);
        const savedTask = await this.syncTaskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.sourceDatabase', 'sourceDatabase')
            .leftJoinAndSelect('task.targetDatabase', 'targetDatabase')
            .where('task.id = :id', { id: newTask.id })
            .getOne();
        if (savedTask?.executionTime && savedTask.isSyncEnabled) {
            this.addCronJob(savedTask);
        }
        return {
            code: 200,
            message: '同步任务创建成功',
        };
    }
    async getSyncTasks(page = 1, limit = 10, order = 'DESC') {
        const [tasks, total] = await this.syncTaskRepository.findAndCount({
            relations: ['sourceDatabase', 'targetDatabase'],
            order: { id: order },
        });
        const groupedTasks = tasks.reduce((acc, task) => {
            const key = `${task.sourceDatabase.id}-${task.targetDatabase.id}`;
            if (!acc[key]) {
                acc[key] = {
                    sourceDatabase: task.sourceDatabase,
                    targetDatabase: task.targetDatabase,
                    tasks: []
                };
            }
            acc[key].tasks.push(task);
            return acc;
        }, {});
        const groupedArray = Object.values(groupedTasks);
        const totalGroups = groupedArray.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedGroups = groupedArray.slice(startIndex, endIndex);
        return {
            code: 200,
            data: {
                items: paginatedGroups,
                total: totalGroups,
                page,
                limit,
                totalPages: Math.ceil(totalGroups / limit),
            },
        };
    }
    validateCronExpression(expression) {
        try {
            new cron_1.CronJob(expression, () => {
            });
            return true;
        }
        catch (error) {
            this.logger.error(`无效的 cron 表达式: ${expression}, 错误信息: ${error.message}`);
            return false;
        }
    }
    async updateSyncTask(id, taskData) {
        if (taskData.executionTime && !this.validateCronExpression(taskData.executionTime)) {
            throw new Error('无效的 cron 表达式');
        }
        await this.syncTaskRepository.update(id, taskData);
        const existingTask = await this.syncTaskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.sourceDatabase', 'sourceDatabase')
            .leftJoinAndSelect('task.targetDatabase', 'targetDatabase')
            .where('task.id = :id', { id })
            .getOne();
        if (!existingTask) {
            throw new Error('同步任务不存在');
        }
        this.removeCronJob(id);
        if (existingTask.executionTime && existingTask.isSyncEnabled) {
            this.addCronJob(existingTask);
        }
        return {
            code: 200,
            message: '同步任务更新成功',
        };
    }
    async deleteSyncTask(id) {
        this.removeCronJob(id);
        return this.dataSource.transaction(async (manager) => {
            await manager.delete(sync_task_log_entity_1.SyncTaskLogEntity, { task: { id } });
            const result = await manager.delete(sync_task_entity_1.SyncTaskEntity, { id });
            return {
                code: 200,
                message: '同步任务删除成功',
                affected: result.affected
            };
        });
    }
    async syncData(task) {
        try {
            const updatedTask = await this.syncTaskRepository.findOne({
                where: { id: task.id },
                relations: ['sourceDatabase', 'targetDatabase']
            });
            if (!updatedTask) {
                throw new Error('无效的同步任务: 任务不存在');
            }
            const sourceDB = updatedTask.sourceDatabase;
            const targetDB = updatedTask.targetDatabase;
            const table = updatedTask.selectedTable;
            const fields = updatedTask.selectedFields;
            if (!sourceDB || !sourceDB.type || !targetDB || !targetDB.type || !table || !fields?.length) {
                throw new Error('任务缺少必要参数，源数据库类型或目标数据库类型未定义');
            }
            this.logger.log(`开始同步任务 ${task.id}，表 ${table}，字段：${fields.join(', ')}`);
            let sourceConnection;
            let targetConnection;
            try {
                if (sourceDB.type === 'mysql') {
                    sourceConnection = await (0, promise_1.createConnection)({
                        host: sourceDB.address,
                        port: parseInt(sourceDB.port),
                        user: sourceDB.username,
                        password: sourceDB.password,
                        database: sourceDB.database,
                    });
                    this.logger.log(`已成功连接到源MySQL数据库: ${sourceDB.database}`);
                }
                else if (sourceDB.type === 'postgres') {
                    sourceConnection = new pg_1.Pool({
                        host: sourceDB.address,
                        port: parseInt(sourceDB.port),
                        user: sourceDB.username,
                        password: sourceDB.password,
                        database: sourceDB.database,
                    });
                    this.logger.log(`已成功连接到源PostgreSQL数据库: ${sourceDB.database}`);
                }
                else {
                    throw new Error(`不支持的源数据库类型: ${sourceDB.type}`);
                }
                const sourceTableExists = await this.checkTableExists(sourceConnection, sourceDB.type, table, sourceDB.database);
                this.logger.log(`源表 ${table} 是否存在: ${sourceTableExists}`);
                if (!sourceTableExists) {
                    throw new Error(`源表 ${table} 在数据库 ${sourceDB.database} 中不存在`);
                }
                const sourceUpdatedAtExists = await this.ensureUpdatedAtFieldExists(sourceConnection, sourceDB.type, table);
                this.logger.log(`源表 ${table} 的updated_at字段状态: ${sourceUpdatedAtExists ? '存在' : '不存在(已添加)'}`);
                if (targetDB.type === 'mysql') {
                    targetConnection = await (0, promise_1.createConnection)({
                        host: targetDB.address,
                        port: parseInt(targetDB.port),
                        user: targetDB.username,
                        password: targetDB.password,
                        database: targetDB.database,
                    });
                    this.logger.log(`已成功连接到目标MySQL数据库: ${targetDB.database}`);
                }
                else if (targetDB.type === 'postgres') {
                    targetConnection = new pg_1.Pool({
                        host: targetDB.address,
                        port: parseInt(targetDB.port),
                        user: targetDB.username,
                        password: targetDB.password,
                        database: targetDB.database,
                    });
                    this.logger.log(`已成功连接到目标PostgreSQL数据库: ${targetDB.database}`);
                }
                else {
                    throw new Error(`不支持的目标数据库类型: ${targetDB.type}`);
                }
                const targetTableExists = await this.checkTableExists(targetConnection, targetDB.type, table, targetDB.database);
                this.logger.log(`目标表 ${table} 是否存在: ${targetTableExists}`);
                if (!targetTableExists) {
                    this.logger.log(`目标表 ${table} 不存在，正在创建...`);
                    await this.createTable(sourceConnection, targetConnection, sourceDB.type, targetDB.type, table, fields);
                    this.logger.log(`目标表 ${table} 创建成功`);
                }
                else {
                    const targetUpdatedAtExists = await this.ensureUpdatedAtFieldExists(targetConnection, targetDB.type, table);
                    this.logger.log(`目标表 ${table} 的updated_at字段状态: ${targetUpdatedAtExists ? '存在' : '不存在(已添加)'}`);
                }
                const primaryKey = await this.getPrimaryKey(sourceConnection, sourceDB.type, table);
                if (!primaryKey) {
                    throw new Error(`无法获取表 ${table} 的主键，无法进行增量同步`);
                }
                this.logger.log(`表 ${table} 的主键是: ${primaryKey}`);
                const [targetCountResult] = await targetConnection.query(`SELECT COUNT(*) AS count FROM ${table}`);
                const beforeCount = targetCountResult?.count ?? 0;
                this.logger.log(`同步前目标表 ${table} 的记录数: ${beforeCount}`);
                await this.fullSync(sourceConnection, targetConnection, sourceDB.type, targetDB.type, table, fields);
                const [newTargetCountResult] = await targetConnection.query(`SELECT COUNT(*) AS count FROM ${table}`);
                const afterCount = newTargetCountResult?.count ?? 0;
                this.logger.log(`同步后目标表 ${table} 的记录数: ${afterCount}`);
                if (afterCount !== beforeCount) {
                    this.logger.log(`全量同步完成，表 ${table}：${beforeCount} -> ${afterCount}`);
                }
                else {
                    this.logger.log('全量同步完成，数据无变化');
                }
                if (updatedTask.isIncrementalSync) {
                    const result = await this.incrementalSync(sourceConnection, targetConnection, sourceDB.type, targetDB.type, table, fields, updatedTask, primaryKey);
                    if (result?.totalFetched > 0) {
                        this.logger.log(`增量同步完成，处理 ${result.totalFetched} 条`);
                        await this.logSyncTask(task, task.isIncrementalSync ? 'incremental' : 'full', true, null, JSON.stringify(result.rows));
                    }
                    else {
                        this.logger.log('增量同步完成，无新增数据');
                    }
                }
            }
            finally {
                if (sourceConnection) {
                    if (sourceDB.type === 'mysql')
                        await sourceConnection.end();
                    if (sourceDB.type === 'postgres')
                        await sourceConnection.end?.();
                    this.logger.log(`已关闭源数据库连接`);
                }
                if (targetConnection) {
                    if (targetDB.type === 'mysql')
                        await targetConnection.end();
                    if (targetDB.type === 'postgres')
                        await targetConnection.end?.();
                    this.logger.log(`已关闭目标数据库连接`);
                }
            }
        }
        catch (error) {
            this.logger.error(`同步任务 ${task.id} 失败: ${error.message}`, error.stack);
            await this.logSyncTask(task, task.isIncrementalSync ? 'incremental' : 'full', false, error.message);
        }
    }
    async getPrimaryKey(connection, dbType, tableName) {
        try {
            if (dbType === 'mysql') {
                const [rows] = await connection.query(`SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = ? AND CONSTRAINT_NAME = 'PRIMARY'`, [tableName]);
                return rows[0]?.COLUMN_NAME ?? null;
            }
            if (dbType === 'postgres') {
                const result = await connection.query(`SELECT a.attname as column_name
FROM pg_index i
JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
WHERE i.indrelid = $1::regclass AND i.indisprimary`, [tableName]);
                return result.rows?.[0]?.column_name ?? null;
            }
            return null;
        }
        catch (e) {
            this.logger.error(`获取表 ${tableName} 主键失败: ${e.message}`);
            return null;
        }
    }
    async ensureUpdatedAtFieldExists(connection, dbType, table) {
        try {
            const tableExists = await this.checkTableExists(connection, dbType, table);
            if (!tableExists) {
                throw new Error(`表 ${table} 不存在，无法添加updated_at字段`);
            }
            for (let attempt = 0; attempt < 3; attempt++) {
                let fieldExists = false;
                if (dbType === 'mysql') {
                    const [columns] = await connection.query(`SHOW COLUMNS FROM ${table} LIKE 'updated_at'`);
                    fieldExists = columns.length > 0;
                }
                else if (dbType === 'postgres') {
                    const result = await connection.query(`SELECT column_name
                    FROM information_schema.columns
                    WHERE table_name = $1 AND column_name = 'updated_at'`, [table]);
                    fieldExists = result.rows.length > 0;
                }
                if (fieldExists) {
                    this.logger.log(`表 ${table} 中已存在updated_at字段`);
                    return true;
                }
                if (dbType === 'mysql') {
                    this.logger.log(`表 ${table} 中不存在updated_at字段，正在添加...`);
                    await connection.query(`ALTER TABLE ${table} ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
                    this.logger.log(`表 ${table} 已添加updated_at字段`);
                }
                else if (dbType === 'postgres') {
                    this.logger.log(`表 ${table} 中不存在updated_at字段，正在添加...`);
                    await connection.query(`ALTER TABLE ${table} ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL`);
                    this.logger.log(`表 ${table} 已添加updated_at字段`);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            throw new Error(`尝试3次添加updated_at字段失败，表 ${table}`);
        }
        catch (error) {
            this.logger.error(`检查或添加updated_at字段失败: ${error.message}`);
            throw error;
        }
    }
    async checkTableExists(connection, dbType, table, database) {
        try {
            if (dbType === 'mysql') {
                if (database) {
                    const [rows] = await connection.query(`SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`, [database, table]);
                    return rows.length > 0;
                }
                else {
                    const [rows] = await connection.query(`SHOW TABLES LIKE '${table}'`);
                    return rows.length > 0;
                }
            }
            else if (dbType === 'postgres') {
                const result = await connection.query(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`, [table]);
                return result.rows[0].exists;
            }
            return false;
        }
        catch (error) {
            this.logger.error(`检查表 ${table} 存在性失败: ${error.message}`);
            return false;
        }
    }
    async createTable(sourceConnection, targetConnection, sourceType, targetType, table, fields) {
        let createTableQuery;
        if (sourceType === 'mysql') {
            const [fieldsInfo] = await sourceConnection.query(`DESCRIBE ${table}`);
            createTableQuery = `CREATE TABLE ${table} (`;
            createTableQuery += fieldsInfo.map(field => `${field.Field} ${field.Type}`).join(', ');
            createTableQuery += ')';
        }
        else if (sourceType === 'postgres') {
            const result = await sourceConnection.query(`SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = $1`, [table]);
            createTableQuery = `CREATE TABLE ${table} (`;
            createTableQuery += result.rows.map(field => `${field.column_name} ${field.data_type}`).join(', ');
            createTableQuery += ')';
        }
        if (targetType === 'mysql' || targetType === 'postgres') {
            await targetConnection.query(createTableQuery);
        }
    }
    async fullSync(sourceConnection, targetConnection, sourceType, targetType, table, fields) {
        let selectQuery = `SELECT ${fields.join(', ')} FROM ${table}`;
        const [rows] = await sourceConnection.query(selectQuery);
        await targetConnection.query(`TRUNCATE TABLE ${table}`);
        for (const row of rows) {
            const insertQuery = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
            const values = fields.map(field => row[field]);
            await targetConnection.query(insertQuery, values);
        }
        return rows.length;
    }
    escapeField(dbType, field) {
        if (dbType === 'mysql') {
            return `\`${field.replace(/`/g, '``')}\``;
        }
        if (dbType === 'postgres') {
            return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
    }
    escapeTable(dbType, tableName) {
        if (dbType === 'mysql') {
            return `\`${tableName.replace(/`/g, '``')}\``;
        }
        if (dbType === 'postgres') {
            return `"${tableName.replace(/"/g, '""')}"`;
        }
        return tableName;
    }
    async updateRecord(connection, dbType, table, fields, primaryKey, row) {
        const updateFields = fields.filter(f => f !== primaryKey);
        const updateClause = updateFields.map(f => `${this.escapeField(dbType, f)} = ?`).join(', ');
        const updateQuery = `UPDATE ${table} SET ${updateClause} WHERE ${this.escapeField(dbType, primaryKey)} = ?`;
        const updateValues = [...updateFields.map(f => row[f]), row[primaryKey]];
        const result = await connection.query(updateQuery, updateValues);
        return result.affectedRows || 0;
    }
    async insertRecord(connection, dbType, table, fields, row) {
        const insertFields = fields.map(f => this.escapeField(dbType, f)).join(', ');
        const insertPlaceholders = fields.map(() => '?').join(', ');
        const insertQuery = `INSERT INTO ${table} (${insertFields}) VALUES (${insertPlaceholders})`;
        const insertValues = fields.map(f => row[f]);
        const result = await connection.query(insertQuery, insertValues);
        return result.affectedRows || 0;
    }
    async incrementalSync(sourceConnection, targetConnection, sourceType, targetType, table, fields, task, primaryKey) {
        try {
            const incrementalField = 'updated_at';
            if (!fields.includes(incrementalField)) {
                fields.push(incrementalField);
            }
            const lastSyncTime = task.lastSyncTime || new Date('1970-01-01');
            this.logger.log(`使用时间戳增量同步 - 最后同步时间: ${lastSyncTime.toISOString()}`);
            const escapedTable = this.escapeTable(sourceType, table);
            const escapedFields = fields.map(f => this.escapeField(sourceType, f)).join(', ');
            const escapedField = this.escapeField(sourceType, incrementalField);
            let selectQuery;
            if (sourceType === 'mysql') {
                selectQuery = `
        SELECT ${escapedFields}
        FROM ${escapedTable}
        WHERE UNIX_TIMESTAMP(${escapedField}) * 1000 > ?
        ORDER BY ${escapedField} ASC
      `;
            }
            else if (sourceType === 'postgres') {
                selectQuery = `
        SELECT ${escapedFields}
        FROM ${escapedTable}
        WHERE EXTRACT(EPOCH FROM ${escapedField}) * 1000 > ?
        ORDER BY ${escapedField} ASC
      `;
            }
            this.logger.log(`增量同步查询语句: ${selectQuery}`);
            this.logger.log(`增量同步查询参数: ${lastSyncTime.getTime()}`);
            const [rows] = await sourceConnection.query(selectQuery, [lastSyncTime.getTime()]);
            this.logger.log(`增量同步从源表获取 ${rows.length} 条记录`);
            if (rows.length === 0) {
                this.logger.log('增量同步完成，无新增数据');
                return {
                    totalFetched: 0,
                    changesApplied: 0,
                    newLastSyncValues: {
                        values: { [incrementalField]: lastSyncTime },
                        timestamp: new Date().toISOString()
                    }
                };
            }
            let changesApplied = 0;
            for (const row of rows) {
                const checkQuery = `SELECT 1 FROM ${table} WHERE ${this.escapeField(targetType, primaryKey)} = ?`;
                const [checkResult] = await targetConnection.query(checkQuery, [row[primaryKey]]);
                if (checkResult.length > 0) {
                    changesApplied += await this.updateRecord(targetConnection, targetType, table, fields, primaryKey, row);
                }
                else {
                    changesApplied += await this.insertRecord(targetConnection, targetType, table, fields, row);
                }
            }
            const newLastSyncTime = new Date();
            await this.syncTaskRepository.update(task.id, {
                lastSyncTime: newLastSyncTime
            });
            this.logger.log(`成功更新任务 ${task.id} 的 lastSyncTime 为 ${newLastSyncTime.toISOString()}`);
            return {
                totalFetched: rows.length,
                changesApplied,
                newLastSyncValues: {
                    values: { [incrementalField]: newLastSyncTime.toISOString() },
                    timestamp: newLastSyncTime.toISOString()
                },
                rows: rows
            };
        }
        catch (error) {
            this.logger.error(`增量同步失败: ${error.message}`, error.stack);
            throw error;
        }
    }
    async logSyncTask(task, syncType, success, errorMessage, rows) {
        const lastLog = await this.syncTaskLogRepository.findOne({
            where: { task: { id: task.id } },
            order: { syncTime: 'DESC' }
        });
        const log = this.syncTaskLogRepository.create({
            data: rows,
            task,
            content: `同步了表 ${task.selectedTable} 的数据`,
            sourceDatabase: task.sourceDatabase.name,
            targetDatabase: task.targetDatabase.name,
            tableName: task.selectedTable,
            fields: task.selectedFields,
            syncTime: new Date(),
            syncType,
            success,
            errorMessage
        });
        try {
            await this.syncTaskLogRepository.save(log);
            console.log("同步任务日志保存成功");
        }
        catch (error) {
            this.logger.error(`保存同步任务日志失败: ${error.message}`, error.stack);
        }
    }
    formatDateTime(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
    async getSyncTaskLogs(page = 1, limit = 10, taskId) {
        const where = taskId ? { task: { id: taskId } } : {};
        const [logs, total] = await this.syncTaskLogRepository.findAndCount({
            where,
            relations: ['task'],
            order: { syncTime: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            code: 200,
            data: {
                items: logs.map(log => ({
                    ...log,
                    syncTime: this.formatDateTime(log.syncTime)
                })),
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async clearSyncTaskLogs() {
        try {
            this.logger.log('开始清空同步任务日志');
            const countBefore = await this.syncTaskLogRepository.count();
            this.logger.log(`当前共有 ${countBefore} 条日志记录`);
            const result = await this.dataSource.transaction(async (manager) => {
                const deleteResult = await manager.createQueryBuilder()
                    .delete()
                    .from(sync_task_log_entity_1.SyncTaskLogEntity)
                    .where("1 = 1")
                    .execute();
                this.logger.log(`事务内删除操作完成，影响记录数: ${deleteResult.affected}`);
                return deleteResult;
            });
            const countAfter = await this.syncTaskLogRepository.count();
            this.logger.log(`删除后剩余 ${countAfter} 条日志记录`);
            if (result.affected === 0 && countBefore > 0) {
                this.logger.error('删除操作返回影响0条记录，但实际有日志存在');
                throw new Error('删除操作未影响任何记录');
            }
            return {
                code: 200,
                message: '同步任务日志清空成功',
                data: {
                    deletedCount: result.affected,
                    remainingCount: countAfter
                }
            };
        }
        catch (error) {
            this.logger.error(`清空同步任务日志失败: ${error.message}`, error.stack);
            throw new Error('清空同步任务日志失败');
        }
    }
    async startSyncTask(id) {
        const task = await this.syncTaskRepository.findOne({
            where: { id },
            relations: ['sourceDatabase', 'targetDatabase']
        });
        if (!task) {
            throw new Error('同步任务不存在');
        }
        task.isExecuting = true;
        await this.syncTaskRepository.save(task);
        const jobName = `syncTask-${id}`;
        if (this.schedulerRegistry.doesExist('cron', jobName)) {
            try {
                const job = this.schedulerRegistry.getCronJob(jobName);
                if (!job.running) {
                    job.start();
                    this.logger.log(`任务 ${id} 的定时任务已启动`);
                }
            }
            catch (error) {
                this.logger.error(`启动任务 ${id} 的定时任务失败: ${error.message}`);
            }
        }
        else {
            if (task.executionTime) {
                this.addCronJob(task);
                this.logger.log(`任务 ${id} 已重新添加到调度器并启动`);
            }
            else {
                throw new Error(`任务 ${id} 没有设置执行时间，无法启动`);
            }
        }
        return {
            code: 200,
            message: '同步任务启动成功',
        };
    }
    async pauseSyncTask(id) {
        const task = await this.syncTaskRepository.findOne({ where: { id } });
        if (!task) {
            throw new Error('同步任务不存在');
        }
        task.isExecuting = false;
        await this.syncTaskRepository.save(task);
        const jobName = `syncTask-${id}`;
        if (this.schedulerRegistry.doesExist('cron', jobName)) {
            try {
                const job = this.schedulerRegistry.getCronJob(jobName);
                job.stop();
                this.logger.log(`任务 ${id} 的定时任务已停止`);
            }
            catch (error) {
                this.logger.error(`停止任务 ${id} 的定时任务失败: ${error.message}`);
            }
        }
        return {
            code: 200,
            message: '同步任务暂停成功',
        };
    }
    async createBatchSyncTasks(batchTaskData) {
        const { sourceDatabase, targetDatabase, selectedTables, executionTime } = batchTaskData;
        const response = await this.dataSourceService.getTablesAndFields(sourceDatabase);
        if (response.code !== 200) {
            throw new Error('获取表和字段信息失败');
        }
        const tablesAndFields = {};
        response.data.forEach((item) => {
            tablesAndFields[item.tableName] = item.fields.map((field) => field.name);
        });
        const createdTasks = [];
        const existingTasks = [];
        const failedTasks = [];
        for (const table of selectedTables) {
            try {
                const taskExists = await this.syncTaskRepository.exist({
                    where: {
                        sourceDatabase: { id: sourceDatabase },
                        targetDatabase: { id: targetDatabase },
                        selectedTable: table
                    }
                });
                if (taskExists) {
                    existingTasks.push(table);
                    continue;
                }
                const selectedFields = tablesAndFields[table] || [];
                const incrementalFields = selectedFields;
                const taskData = {
                    sourceDatabase: { id: sourceDatabase },
                    targetDatabase: { id: targetDatabase },
                    selectedTable: table,
                    selectedFields: selectedFields,
                    executionTime: executionTime,
                    isSyncEnabled: true,
                    isIncrementalSync: true,
                    incrementalFields: incrementalFields,
                    isExecuting: true,
                    lastSyncTime: new Date()
                };
                const newTask = this.syncTaskRepository.create(taskData);
                const savedTask = await this.syncTaskRepository.save(newTask);
                const taskWithRelations = await this.syncTaskRepository
                    .createQueryBuilder('task')
                    .leftJoinAndSelect('task.sourceDatabase', 'sourceDatabase')
                    .leftJoinAndSelect('task.targetDatabase', 'targetDatabase')
                    .where('task.id = :id', { id: savedTask.id })
                    .getOne();
                if (taskWithRelations?.executionTime && taskWithRelations.isSyncEnabled) {
                    this.addCronJob(taskWithRelations);
                }
                createdTasks.push({ table, id: savedTask.id });
            }
            catch (error) {
                this.logger.error(`创建表 ${table} 的同步任务失败: ${error.message}`);
                failedTasks.push({ table, error: error.message });
            }
        }
        return {
            code: 200,
            message: '批量创建任务完成',
            data: {
                total: selectedTables.length,
                created: createdTasks.length,
                existing: existingTasks.length,
                failed: failedTasks.length,
                createdTasks,
                existingTasks,
                failedTasks
            }
        };
    }
};
exports.SyncTaskService = SyncTaskService;
exports.SyncTaskService = SyncTaskService = SyncTaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sync_task_entity_1.SyncTaskEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(sync_task_log_entity_1.SyncTaskLogEntity)),
    __param(3, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        atasource_service_1.DataSourceService,
        typeorm_2.DataSource,
        schedule_1.SchedulerRegistry])
], SyncTaskService);
//# sourceMappingURL=sync-task.service.js.map