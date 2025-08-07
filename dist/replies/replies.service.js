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
exports.RepliesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const users_service_1 = require("../Users/users.service");
const comments_service_1 = require("../comments/comments.service");
let RepliesService = class RepliesService {
    constructor(replyModel, usersService, commentsService) {
        this.replyModel = replyModel;
        this.usersService = usersService;
        this.commentsService = commentsService;
    }
    async findAll() {
        const findAllI = await this.replyModel.find().exec();
        return findAllI;
    }
    async findById(id) {
        return id.match(/^[0-9a-fA-F]{24}$/)
            ? await this.replyModel.findOne({ _id: id })
            : null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return await this.replyModel.findOne({ _id: id });
        }
    }
    async create(reply) {
        try {
            console.log('Creating reply with data:', JSON.stringify(reply, null, 2));
            const newReply = await new this.replyModel(reply);
            const savedReply = await newReply.save();
            console.log(`✅ Reply created successfully: ${savedReply._id}`);
            if (newReply.parentReply) {
                console.log(`✅ Nested reply created with parent: ${newReply.parentReply}`);
                console.log(`✅ Nested reply created successfully with parent reference`);
            }
            else {
                if (reply.commentId) {
                    try {
                        const comment = await this.commentsService.findById(reply.commentId.toString());
                        if (comment) {
                            if (!comment.replies) {
                                comment.replies = [];
                            }
                            comment.replies.push(savedReply._id.toString());
                            await this.commentsService.update(reply.commentId.toString(), {
                                replies: comment.replies
                            });
                            console.log(`✅ Top-level reply added to comment: ${reply.commentId}`);
                        }
                    }
                    catch (commentError) {
                        console.error('⚠️ Comment update failed:', commentError);
                    }
                }
            }
            console.log(`✅ Reply created for user: ${newReply.author}`);
            return savedReply;
        }
        catch (error) {
            console.error('❌ Error creating reply:', error);
            throw error;
        }
    }
    async getReplyWithNestedReplies(replyId) {
        try {
            const reply = await this.replyModel.findById(replyId).lean();
            if (!reply) {
                throw new Error('Reply not found');
            }
            async function populateReplies(reply, replyModel) {
                if (reply.replies && reply.replies.length > 0) {
                    reply.replies = await Promise.all(reply.replies.map(async (nestedReplyId) => {
                        const nestedReply = await replyModel.findById(nestedReplyId).lean();
                        if (nestedReply) {
                            return await populateReplies(nestedReply, replyModel);
                        }
                        return null;
                    }));
                    reply.replies = reply.replies.filter(r => r !== null);
                }
                return reply;
            }
            const populatedReply = await populateReplies(reply, this.replyModel);
            console.log(`✅ Retrieved nested replies for reply: ${replyId}`);
            return populatedReply;
        }
        catch (error) {
            console.error('❌ Error getting nested replies:', error);
            throw error;
        }
    }
    async delete(id) {
        return this.replyModel.findByIdAndDelete(id);
    }
    async update(id, reply) {
        return await this.replyModel.findByIdAndUpdate(id, reply, {
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
        return await this.replyModel.findByIdAndUpdate(id, { points: item.points + 1 }, { new: true });
    }
    async downVote(id, currentUser) {
        const item = await this.findById(id);
        const user = await this.usersService.findByUsername(currentUser.currentUserName);
        const newUpVotedSubmissions = user.upvotedSubmissions.filter((vote) => vote !== id);
        this.usersService.update(user.id, {
            upvotedSubmissions: newUpVotedSubmissions,
        });
        return await this.replyModel.findByIdAndUpdate(id, { points: item.points - 1 }, { new: true });
    }
};
exports.RepliesService = RepliesService;
exports.RepliesService = RepliesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Reply')),
    __param(1, (0, common_1.Inject)(users_service_1.UsersService)),
    __param(2, (0, common_1.Inject)(comments_service_1.CommentsService)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        users_service_1.UsersService,
        comments_service_1.CommentsService])
], RepliesService);
//# sourceMappingURL=replies.service.js.map