"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const items_module_1 = require("./items/items.module");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const logger_service_1 = require("./logger/logger.service");
const configuration_1 = require("./config/configuration");
const comments_module_1 = require("./comments/comments.module");
const jobs_module_1 = require("./jobs/jobs.module");
const replies_module_1 = require("./replies/replies.module");
const users_module_1 = require("./Users/users.module");
const auth_module_1 = require("./auth/auth.module");
const markets_module_1 = require("./markets/markets.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            items_module_1.ItemsModule,
            comments_module_1.CommentsModule,
            jobs_module_1.JobsModule,
            replies_module_1.RepliesModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            markets_module_1.MarketsModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    uri: `${configService.get('database.uri')}`,
                    tls: true,
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [],
        providers: [logger_service_1.LoggerService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map