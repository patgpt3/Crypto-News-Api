"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const logger_service_1 = require("../logger/logger.service");
const users_module_1 = require("../Users/users.module");
const jwt_1 = require("@nestjs/jwt");
const local_strategy_1 = require("./stratagies/local-strategy");
const jwt_strategy_1 = require("./stratagies/jwt-strategy");
const privy_webhook_controller_1 = require("./privy-webhook.controller");
const privy_verify_controller_1 = require("./privy-verify.controller");
const privy_sync_controller_1 = require("./privy-sync.controller");
const privy_auth_service_1 = require("./privy-auth.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: `${process.env.jwt_secret}`,
                signOptions: { expiresIn: '3600' },
            }),
            users_module_1.UsersModule,
        ],
        controllers: [auth_controller_1.AuthController, privy_webhook_controller_1.PrivyWebhookController, privy_verify_controller_1.PrivyVerifyController, privy_sync_controller_1.PrivySyncController],
        providers: [
            auth_service_1.AuthService,
            logger_service_1.LoggerService,
            jwt_strategy_1.JwtStrategy,
            local_strategy_1.LocalStrategy,
            privy_auth_service_1.PrivyAuthService,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map