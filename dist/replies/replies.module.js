"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepliesModule = void 0;
const common_1 = require("@nestjs/common");
const replies_controller_1 = require("./replies.controller");
const replies_service_1 = require("./replies.service");
const reply_schema_1 = require("./schemas/reply.schema");
const mongoose_1 = require("@nestjs/mongoose");
const logger_service_1 = require("../logger/logger.service");
const comment_schema_1 = require("../comments/schemas/comment.schema");
const users_module_1 = require("../Users/users.module");
const comments_service_1 = require("../comments/comments.service");
const item_schema_1 = require("../items/schemas/item.schema");
const items_service_1 = require("../items/items.service");
let RepliesModule = class RepliesModule {
};
exports.RepliesModule = RepliesModule;
exports.RepliesModule = RepliesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Reply', schema: reply_schema_1.ReplySchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Comment', schema: comment_schema_1.CommentSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Item', schema: item_schema_1.ItemSchema }]),
            users_module_1.UsersModule,
        ],
        controllers: [replies_controller_1.RepliesController],
        providers: [
            replies_service_1.RepliesService,
            logger_service_1.LoggerService,
            comments_service_1.CommentsService,
            items_service_1.ItemsService,
        ],
    })
], RepliesModule);
//# sourceMappingURL=replies.module.js.map