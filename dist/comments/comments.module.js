"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = void 0;
const common_1 = require("@nestjs/common");
const comments_controller_1 = require("./comments.controller");
const comments_service_1 = require("./comments.service");
const comment_schema_1 = require("./schemas/comment.schema");
const mongoose_1 = require("@nestjs/mongoose");
const logger_service_1 = require("../logger/logger.service");
const items_service_1 = require("../items/items.service");
const users_module_1 = require("../Users/users.module");
const item_schema_1 = require("../items/schemas/item.schema");
let CommentsModule = class CommentsModule {
};
exports.CommentsModule = CommentsModule;
exports.CommentsModule = CommentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Comment', schema: comment_schema_1.CommentSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Item', schema: item_schema_1.ItemSchema }]),
            users_module_1.UsersModule,
        ],
        controllers: [comments_controller_1.CommentsController],
        providers: [comments_service_1.CommentsService, logger_service_1.LoggerService, items_service_1.ItemsService],
    })
], CommentsModule);
//# sourceMappingURL=comments.module.js.map