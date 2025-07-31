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
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const users_service_1 = require("../Users/users.service");
let ItemsService = class ItemsService {
    constructor(itemModel, commentModel, usersService) {
        this.itemModel = itemModel;
        this.commentModel = commentModel;
        this.usersService = usersService;
    }
    async findAll() {
        const findAllI = await this.itemModel.find().exec();
        return findAllI;
    }
    async findAllPast() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const findAllI = await this.itemModel.find().exec();
        const itemsBeforeToday = findAllI.filter((item) => item.createdAt < today);
        return itemsBeforeToday;
    }
    async findAllNewest() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const findAllI = await this.itemModel.find().exec();
        const itemsNewest = findAllI.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return itemsNewest;
    }
    async findAllMain() {
        const findAllI = await this.itemModel.find().exec();
        const itemsMain = findAllI.sort((a, b) => b.points / (Math.log(Date.now() - b.createdAt.getTime()) * 6) -
            a.points / (Math.log(Date.now() - a.createdAt.getTime()) * 6));
        return itemsMain;
    }
    async findAllMainPagination(page) {
        const pageSize = 30;
        const skip = page * pageSize;
        const itemsMain = await this.itemModel.aggregate([
            {
                $addFields: {
                    customScore: {
                        $divide: [
                            '$points',
                            {
                                $multiply: [
                                    { $log10: { $subtract: [new Date(), '$createdAt'] } },
                                    6,
                                ],
                            },
                        ],
                    },
                },
            },
            { $sort: { customScore: -1 } },
            { $skip: skip },
            { $limit: pageSize },
        ]);
        return itemsMain;
    }
    async findAllMainPaginationByCategory(page, category) {
        const pageSize = 30;
        const skip = page * pageSize;
        const itemsMain = await this.itemModel.aggregate([
            { $match: { category: category } },
            {
                $addFields: {
                    customScore: {
                        $divide: [
                            '$points',
                            {
                                $multiply: [
                                    { $log10: { $subtract: [new Date(), '$createdAt'] } },
                                    6,
                                ],
                            },
                        ],
                    },
                },
            },
            { $sort: { customScore: -1 } },
            { $skip: skip },
            { $limit: pageSize },
        ]);
        return itemsMain;
    }
    async findAllNewestPagination(page) {
        const pageSize = 30;
        const skip = page * pageSize;
        const itemsMain = await this.itemModel
            .find()
            .sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(pageSize)
            .exec();
        return itemsMain;
    }
    async findAllAskPagination(page) {
        const pageSize = 30;
        const skip = page * pageSize;
        const itemsMain = await this.itemModel
            .find({ title: { $regex: '^AskAIN', $options: 'i' } })
            .sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(pageSize)
            .exec();
        return itemsMain;
    }
    async findAllShowPagination(page) {
        const pageSize = 30;
        const skip = page * pageSize;
        const itemsMain = await this.itemModel
            .find({ title: { $regex: '^ShowAIN', $options: 'i' } })
            .sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(pageSize)
            .exec();
        return itemsMain;
    }
    async findAllShow() {
        const findAllI = await this.itemModel.find().exec();
        const itemsShow = findAllI.filter((item) => item.title.startsWith('ShowCN:'));
        return itemsShow;
    }
    async findAllAsk() {
        const findAllI = await this.itemModel.find().exec();
        const itemsAsk = findAllI.filter((item) => item.title.startsWith('AskCN:'));
        return itemsAsk;
    }
    async findById(id) {
        return id.match(/^[0-9a-fA-F]{24}$/)
            ? await this.itemModel.findOne({ _id: id })
            : null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return await this.itemModel.findOne({ _id: id });
        }
    }
    async findByNewest(id) {
        return id.match(/^[0-9a-fA-F]{24}$/)
            ? await this.itemModel.findOne({ _id: id })
            : null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return await this.itemModel.findOne({ _id: id });
        }
    }
    async findByPast(id) {
        return id.match(/^[0-9a-fA-F]{24}$/)
            ? await this.itemModel.findOne({ _id: id })
            : null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return await this.itemModel.findOne({ _id: id });
        }
    }
    async findByAlg(id) {
        return id.match(/^[0-9a-fA-F]{24}$/)
            ? await this.itemModel.findOne({ _id: id })
            : null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return await this.itemModel.findOne({ _id: id });
        }
    }
    async create(item) {
        const newItem = await new this.itemModel(item);
        try {
            const user = await this.usersService.findByUsername(newItem.author);
            if (user) {
                const newSubmissions = user.submissions || [];
                newSubmissions.push(newItem.id);
                await this.usersService.update(user.id, {
                    submissions: newSubmissions,
                });
            }
        }
        catch (error) {
            console.log('Warning: Could not update user submissions:', error.message);
        }
        return newItem.save();
    }
    async delete(id) {
        const item = await this.itemModel.findById(id);
        await this.commentModel.deleteMany({ _id: { $in: item.comments } });
        return this.itemModel.findByIdAndDelete(id);
    }
    async update(id, item) {
        return await this.itemModel.findByIdAndUpdate(id, item, { new: true });
    }
    async upVote(id, currentUser) {
        const item = await this.findById(id);
        const user = await this.usersService.findByUsername(currentUser.currentUserName);
        const newUpvotes = user?.upvotedSubmissions;
        newUpvotes?.push(id);
        this.usersService.update(user.id, {
            upvotedSubmissions: newUpvotes || [id],
        });
        return await this.itemModel.findByIdAndUpdate(id, { points: item.points + 1 }, { new: true });
    }
    async downVote(id, currentUser) {
        const item = await this.findById(id);
        const user = await this.usersService.findByUsername(currentUser.currentUserName);
        const newUpVotedSubmissions = user.upvotedSubmissions.filter((vote) => vote !== id);
        this.usersService.update(user.id, {
            upvotedSubmissions: newUpVotedSubmissions,
        });
        return await this.itemModel.findByIdAndUpdate(id, { points: item.points - 1 }, { new: true });
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Item')),
    __param(1, (0, mongoose_2.InjectModel)('Comment')),
    __param(2, (0, common_1.Inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        users_service_1.UsersService])
], ItemsService);
//# sourceMappingURL=items.service.js.map