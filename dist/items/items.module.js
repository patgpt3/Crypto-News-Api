"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsModule = void 0;
const common_1 = require("@nestjs/common");
const items_controller_1 = require("./items.controller");
const items_service_1 = require("./items.service");
const mongoose_1 = require("@nestjs/mongoose");
const item_schema_1 = require("./schemas/item.schema");
const logger_service_1 = require("../logger/logger.service");
const users_module_1 = require("../Users/users.module");
const comments_service_1 = require("../comments/comments.service");
const comment_schema_1 = require("../comments/schemas/comment.schema");
let ItemsModule = class ItemsModule {
};
exports.ItemsModule = ItemsModule;
exports.ItemsModule = ItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Item', schema: item_schema_1.ItemSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Comment', schema: comment_schema_1.CommentSchema }]),
            users_module_1.UsersModule,
        ],
        controllers: [items_controller_1.ItemsController],
        providers: [items_service_1.ItemsService, logger_service_1.LoggerService, comments_service_1.CommentsService],
    })
], ItemsModule);
//# sourceMappingURL=items.module.js.map