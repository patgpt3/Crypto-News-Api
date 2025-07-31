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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const users_service_1 = require("../Users/users.service");
let JobsService = class JobsService {
    constructor(jobModel, usersService) {
        this.jobModel = jobModel;
        this.usersService = usersService;
    }
    async findAll() {
        const findAllI = await this.jobModel.find().exec();
        return findAllI;
    }
    async findAllNewest() {
        const findAllj = await this.jobModel.find().exec();
        const jobsNewest = findAllj.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return jobsNewest;
    }
    async findAllNewestPagination(page) {
        const pageSize = 30;
        const skip = page * pageSize;
        const itemsMain = await this.jobModel
            .find()
            .sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(pageSize)
            .exec();
        return itemsMain;
    }
    async findById(id) {
        return id.match(/^[0-9a-fA-F]{24}$/)
            ? await this.jobModel.findOne({ _id: id })
            : null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return await this.jobModel.findOne({ _id: id });
        }
    }
    async create(job) {
        const newJob = await new this.jobModel(job);
        const user = await this.usersService.findByUsername(newJob.author);
        console.log(user);
        const newUserJob = user.jobs;
        newUserJob?.push(newJob.id);
        console.log(newJob.id);
        this.usersService.update(user.id, {
            jobs: newUserJob || [newJob.id],
        });
        return newJob.save();
    }
    async delete(id) {
        return this.jobModel.findByIdAndDelete(id);
    }
    async update(id, job) {
        return await this.jobModel.findByIdAndUpdate(id, job, { new: true });
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Job')),
    __param(1, (0, common_1.Inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        users_service_1.UsersService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map