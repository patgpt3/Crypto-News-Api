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
exports.RepliesController = void 0;
const common_1 = require("@nestjs/common");
const reply_dto_1 = require("./dto/reply.dto");
const replies_service_1 = require("./replies.service");
const logger_service_1 = require("../logger/logger.service");
let RepliesController = class RepliesController {
    constructor(repliesService, logger) {
        this.repliesService = repliesService;
        this.logger = logger;
    }
    async findAll() {
        this.logger.debug('Get All Replies Endpoint');
        const fa = await this.repliesService.findAll();
        return fa;
    }
    async findById(param) {
        this.logger.debug('Get Reply by ID Endpoint');
        return this.repliesService.findById(param.id);
    }
    async getReplyWithNestedReplies(param) {
        this.logger.debug('Get Reply with Replies Endpoint');
        return this.repliesService.getReplyWithNestedReplies(param.id);
    }
    async findbyIds(idsObj) {
        this.logger.debug('Get All Replies by Ids Endpoint');
        const results = [];
        const ids = idsObj.replies;
        console.log(ids);
        for (const id of ids) {
            try {
                console.log(id);
                const data = await this.repliesService.getReplyWithNestedReplies(id);
                console.log(data);
                results.push(data);
            }
            catch (error) {
                console.error(`Error fetching data for ID ${id}:`, error);
            }
        }
        return results;
    }
    async create(replyDTO) {
        this.logger.debug('Create Reply Endpoint');
        const createI = await this.repliesService.create(replyDTO);
        return createI;
    }
    async update(param, replyDTO) {
        this.logger.debug('Update Replies Endpoint');
        return this.repliesService.update(param.id, replyDTO);
    }
    async delete(param) {
        this.logger.debug('Delete Reply Endpoint');
        return this.repliesService.delete(param.id);
    }
    async upVote(param, currentUser) {
        this.logger.debug('Up Vote Reply Endpoint');
        const fa = await this.repliesService.upVote(param.id, currentUser);
        return fa;
    }
    async downVote(param, currentUser) {
        this.logger.debug('Down Vote Reply Endpoint');
        const fa = await this.repliesService.downVote(param.id, currentUser);
        return fa;
    }
};
exports.RepliesController = RepliesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('replies/nested/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "getReplyWithNestedReplies", null);
__decorate([
    (0, common_1.Post)('replies/findbyIds'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "findbyIds", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reply_dto_1.ReplyDTO]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reply_dto_1.ReplyDTO]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)('upVote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "upVote", null);
__decorate([
    (0, common_1.Put)('downVote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RepliesController.prototype, "downVote", null);
exports.RepliesController = RepliesController = __decorate([
    (0, common_1.Controller)('replies'),
    __param(0, (0, common_1.Inject)(replies_service_1.RepliesService)),
    __metadata("design:paramtypes", [replies_service_1.RepliesService,
        logger_service_1.LoggerService])
], RepliesController);
//# sourceMappingURL=replies.controller.js.map