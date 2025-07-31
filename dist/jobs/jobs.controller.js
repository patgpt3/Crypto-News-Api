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
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const jobs_dto_1 = require("./dto/jobs.dto");
const logger_service_1 = require("../logger/logger.service");
const jobs_service_1 = require("./jobs.service");
let JobsController = class JobsController {
    constructor(jobsService, logger) {
        this.jobsService = jobsService;
        this.logger = logger;
    }
    async findAll() {
        this.logger.debug('Get All jobs Endpoint');
        const fa = await this.jobsService.findAll();
        return fa;
    }
    async findById(param) {
        this.logger.debug('Get Job by ID Endpoint');
        return this.jobsService.findById(param.id);
    }
    async findbyIds(idsObj) {
        this.logger.debug('Get All jobs by Ids Endpoint');
        const results = [];
        const ids = idsObj.jobs;
        console.log(ids);
        for (const id of ids) {
            try {
                console.log(id);
                const data = await this.jobsService.findById(id);
                console.log(data);
                results.push(data);
            }
            catch (error) {
                console.error(`Error fetching data for ID ${id}:`, error);
            }
        }
        return results;
    }
    async findAllNewest() {
        this.logger.debug('Get All Newest Jobs Endpoint');
        const fa = await this.jobsService.findAllNewest();
        return fa;
    }
    async findAllNewestPagination(param, page) {
        this.logger.debug('Get All New Jobs Pages Endpoint');
        const fa = await this.jobsService.findAllNewestPagination(page.pageNumber);
        return fa;
    }
    async create(jobDTO) {
        this.logger.debug('Create Job Endpoint');
        const createI = await this.jobsService.create(jobDTO);
        return createI;
    }
    async update(param, jobDTO) {
        this.logger.debug('Update jobs Endpoint');
        return this.jobsService.update(param.id, jobDTO);
    }
    async delete(param) {
        this.logger.debug('Delete Job Endpoint');
        return this.jobsService.delete(param.id);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)('jobs/findbyIds'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "findbyIds", null);
__decorate([
    (0, common_1.Get)('jobs/newest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "findAllNewest", null);
__decorate([
    (0, common_1.Put)('jobs/newest/pages'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "findAllNewestPagination", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jobs_dto_1.JobDTO]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, jobs_dto_1.JobDTO]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "delete", null);
exports.JobsController = JobsController = __decorate([
    (0, common_1.Controller)('jobs'),
    __param(0, (0, common_1.Inject)(jobs_service_1.JobsService)),
    __metadata("design:paramtypes", [jobs_service_1.JobsService,
        logger_service_1.LoggerService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map