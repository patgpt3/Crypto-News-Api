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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const users_service_1 = require("../Users/users.service");
const items_service_1 = require("../items/items.service");
let CommentsService = class CommentsService {
    constructor(commentModel, usersService, itemsService) {
        this.commentModel = commentModel;
        this.usersService = usersService;
        this.itemsService = itemsService;
    }
    async findAll() {
        const findAllI = await this.commentModel.find().exec();
        return findAllI;
    }
    async findAllNewest() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const findAllI = await this.commentModel.find().exec();
        const itemsNewest = findAllI.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return itemsNewest;
    }
    async findAllNewestPagination(page) {
        const pageSize = 30;
        const skip = page * pageSize;
        const itemsMain = await this.commentModel
            .find()
            .sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(pageSize)
            .exec();
        return itemsMain;
    }
    async findAllNewestPaginationByCategory(page, category) {
        const pageSize = 30;
        const skip = page * pageSize;
        const commentsNewest = await this.commentModel
            .find({ category: category?.toLowerCase() })
            .sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(pageSize)
            .exec();
        return commentsNewest;
    }
    async findById(id) {
        return id.match(/^[0-9a-fA-F]{24}$/)
            ? await this.commentModel.findOne({ _id: id })
            : null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return await this.commentModel.findOne({ _id: id });
        }
    }
    async create(comment) {
        const newComment = await new this.commentModel(comment);
        if (newComment.category) {
            newComment.category = newComment.category.toLowerCase();
        }
        const user = await this.usersService.findByUsername(newComment.author);
        const newUserComment = user.comments;
        newUserComment?.push(newComment.id);
        this.usersService.update(user.id, {
            comments: newUserComment || [newComment.id],
        });
        const item = await this.itemsService.findById(newComment.item);
        const newItemComments = item.comments;
        newItemComments?.push(newComment.id);
        this.itemsService.update(item.id, {
            comments: newItemComments || [newComment.id],
        });
        return newComment.save();
    }
    async delete(id) {
        return this.commentModel.findByIdAndDelete(id);
    }
    async update(id, comment) {
        return await this.commentModel.findByIdAndUpdate(id, comment, {
            new: true,
        });
    }
    async upVote(id, currentUser) {
        const item = await this.findById(id);
        const user = await this.usersService.findByUsername(currentUser.currentUserName);
        const newUpvotes = user?.upvotedSubmissions;
        newUpvotes?.push(id);
        this.usersService.update(user.id, {
            upvotedSubmissions: newUpvotes || [id],
        });
        return await this.commentModel.findByIdAndUpdate(id, { points: item.points + 1 }, { new: true });
    }
    async downVote(id, currentUser) {
        const item = await this.findById(id);
        const user = await this.usersService.findByUsername(currentUser.currentUserName);
        const newUpVotedSubmissions = user.upvotedSubmissions.filter((vote) => vote !== id);
        this.usersService.update(user.id, {
            upvotedSubmissions: newUpVotedSubmissions,
        });
        return await this.commentModel.findByIdAndUpdate(id, { points: item.points - 1 }, { new: true });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Comment')),
    __param(1, (0, common_1.Inject)(users_service_1.UsersService)),
    __param(2, (0, common_1.Inject)(items_service_1.ItemsService)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        users_service_1.UsersService,
        items_service_1.ItemsService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map