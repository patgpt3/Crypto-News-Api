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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const comment_dto_1 = require("./dto/comment.dto");
const comments_service_1 = require("./comments.service");
const logger_service_1 = require("../logger/logger.service");
let CommentsController = class CommentsController {
    constructor(commentsService, logger) {
        this.commentsService = commentsService;
        this.logger = logger;
    }
    async findAll() {
        this.logger.debug('Get All Comments Endpoint');
        const fa = await this.commentsService.findAll();
        return fa;
    }
    async findById(param) {
        this.logger.debug('Get Comment by ID Endpoint');
        return this.commentsService.findById(param.id);
    }
    async findAllNewest() {
        this.logger.debug('Get All Newest Comments Endpoint');
        const fa = await this.commentsService.findAllNewest();
        return fa;
    }
    async findAllNewestPagination(param, page) {
        this.logger.debug('Get All New Comments Pages Endpoint');
        const fa = await this.commentsService.findAllNewestPagination(page.pageNumber);
        return fa;
    }
    async findbyIds(idsObj) {
        this.logger.debug('Get All Comments by Ids Endpoint');
        const results = [];
        const ids = idsObj.comments;
        console.log(ids);
        for (const id of ids) {
            try {
                console.log(id);
                const data = await this.commentsService.findById(id);
                console.log(data);
                results.push(data);
            }
            catch (error) {
                console.error(`Error fetching data for ID ${id}:`, error);
            }
        }
        return results;
    }
    async create(commentDTO) {
        this.logger.debug('Create Comment Endpoint');
        const createI = await this.commentsService.create(commentDTO);
        return createI;
    }
    async update(param, commentDTO) {
        this.logger.debug('Update Comments Endpoint');
        return this.commentsService.update(param.id, commentDTO);
    }
    async upVote(param, currentUser) {
        this.logger.debug('Up Vote Comment Endpoint');
        const fa = await this.commentsService.upVote(param.id, currentUser);
        return fa;
    }
    async downVote(param, currentUser) {
        this.logger.debug('Down Vote Comment Endpoint');
        const fa = await this.commentsService.downVote(param.id, currentUser);
        return fa;
    }
    async delete(param) {
        this.logger.debug('Delete Comment Endpoint');
        return this.commentsService.delete(param.id);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('comments/newest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "findAllNewest", null);
__decorate([
    (0, common_1.Put)('comments/newest/pages'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "findAllNewestPagination", null);
__decorate([
    (0, common_1.Post)('comments/findbyIds'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "findbyIds", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_dto_1.CommentDTO]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, comment_dto_1.CommentDTO]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('upVote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "upVote", null);
__decorate([
    (0, common_1.Put)('downVote/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "downVote", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "delete", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)('comments'),
    __param(0, (0, common_1.Inject)(comments_service_1.CommentsService)),
    __metadata("design:paramtypes", [comments_service_1.CommentsService,
        logger_service_1.LoggerService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map