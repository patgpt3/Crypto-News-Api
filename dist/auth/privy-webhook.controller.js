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
exports.PrivyWebhookController = void 0;
const common_1 = require("@nestjs/common");
const privy_auth_service_1 = require("./privy-auth.service");
const users_service_1 = require("../Users/users.service");
let PrivyWebhookController = class PrivyWebhookController {
    constructor(privyAuthService, usersService) {
        this.privyAuthService = privyAuthService;
        this.usersService = usersService;
    }
    async handleUserCreated(body, signature) {
        try {
            console.log('🔔 Privy webhook received:', body);
            const { user } = body;
            if (!user || !user.id) {
                throw new common_1.HttpException('Invalid user data', common_1.HttpStatus.BAD_REQUEST);
            }
            console.log('👤 Creating user from Privy webhook:', user.id);
            const existingUser = await this.usersService.findByPrivyId(user.id);
            if (existingUser) {
                console.log('✅ User already exists:', user.id);
                return { success: true, message: 'User already exists' };
            }
            const defaultUsername = `user_${user.id.slice(0, 8)}`;
            const userData = await this.privyAuthService.createUserFromPrivy(user.id, defaultUsername);
            const newUser = await this.usersService.create(userData);
            console.log('✅ User created from webhook:', newUser);
            return { success: true, user: newUser };
        }
        catch (error) {
            console.error('❌ Webhook error:', error);
            throw new common_1.HttpException('Webhook processing failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleUserUpdated(body, signature) {
        try {
            console.log('🔄 Privy user updated webhook:', body);
            const { user } = body;
            if (!user || !user.id) {
                throw new common_1.HttpException('Invalid user data', common_1.HttpStatus.BAD_REQUEST);
            }
            const existingUser = await this.usersService.findByPrivyId(user.id);
            if (existingUser) {
                console.log('✅ User updated from webhook:', user.id);
            }
            return { success: true };
        }
        catch (error) {
            console.error('❌ User update webhook error:', error);
            throw new common_1.HttpException('Webhook processing failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PrivyWebhookController = PrivyWebhookController;
__decorate([
    (0, common_1.Post)('user-created'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('privy-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PrivyWebhookController.prototype, "handleUserCreated", null);
__decorate([
    (0, common_1.Post)('user-updated'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('privy-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PrivyWebhookController.prototype, "handleUserUpdated", null);
exports.PrivyWebhookController = PrivyWebhookController = __decorate([
    (0, common_1.Controller)('webhooks/privy'),
    __metadata("design:paramtypes", [privy_auth_service_1.PrivyAuthService,
        users_service_1.UsersService])
], PrivyWebhookController);
//# sourceMappingURL=privy-webhook.controller.js.map