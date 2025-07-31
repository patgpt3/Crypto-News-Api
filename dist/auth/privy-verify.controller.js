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
exports.PrivyVerifyController = void 0;
const common_1 = require("@nestjs/common");
const privy_auth_service_1 = require("./privy-auth.service");
const users_service_1 = require("../Users/users.service");
let PrivyVerifyController = class PrivyVerifyController {
    constructor(privyAuthService, usersService) {
        this.privyAuthService = privyAuthService;
        this.usersService = usersService;
    }
    async verifyAndCreateUser(body) {
        try {
            console.log('🔍 Verifying Privy user:', body.privyId);
            const existingUser = await this.usersService.findByPrivyId(body.privyId);
            if (existingUser) {
                console.log('✅ User already exists:', body.privyId);
                return {
                    success: true,
                    message: 'User already exists',
                    user: existingUser
                };
            }
            const isValid = await this.privyAuthService.verifyPrivyUser(body.privyId, body.authToken);
            if (!isValid) {
                throw new Error('Invalid Privy user');
            }
            const userData = await this.privyAuthService.createUserFromPrivy(body.privyId, body.username, body.authToken);
            const newUser = await this.usersService.create(userData);
            console.log('✅ User verified and created:', newUser);
            return {
                success: true,
                message: 'User verified and created successfully',
                user: newUser
            };
        }
        catch (error) {
            console.error('❌ User verification failed:', error);
            throw error;
        }
    }
    async getUserByPrivyId(privyId) {
        try {
            const user = await this.usersService.findByPrivyId(privyId);
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            return { success: true, user };
        }
        catch (error) {
            console.error('❌ Error fetching user:', error);
            throw error;
        }
    }
    async syncUsers(body) {
        try {
            console.log('🔄 Syncing users:', body.privyIds);
            const results = [];
            for (const privyId of body.privyIds) {
                try {
                    const user = await this.usersService.findByPrivyId(privyId);
                    if (user) {
                        results.push({ privyId, status: 'exists', user });
                    }
                    else {
                        results.push({ privyId, status: 'missing' });
                    }
                }
                catch (error) {
                    results.push({ privyId, status: 'error', error: error.message });
                }
            }
            return { success: true, results };
        }
        catch (error) {
            console.error('❌ User sync failed:', error);
            throw error;
        }
    }
};
exports.PrivyVerifyController = PrivyVerifyController;
__decorate([
    (0, common_1.Post)('verify-user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivyVerifyController.prototype, "verifyAndCreateUser", null);
__decorate([
    (0, common_1.Get)('user/:privyId'),
    __param(0, (0, common_1.Param)('privyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrivyVerifyController.prototype, "getUserByPrivyId", null);
__decorate([
    (0, common_1.Post)('sync-users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivyVerifyController.prototype, "syncUsers", null);
exports.PrivyVerifyController = PrivyVerifyController = __decorate([
    (0, common_1.Controller)('privy'),
    __metadata("design:paramtypes", [privy_auth_service_1.PrivyAuthService,
        users_service_1.UsersService])
], PrivyVerifyController);
//# sourceMappingURL=privy-verify.controller.js.map