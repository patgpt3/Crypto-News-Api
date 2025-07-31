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
exports.PrivySyncController = void 0;
const common_1 = require("@nestjs/common");
const privy_auth_service_1 = require("./privy-auth.service");
const users_service_1 = require("../Users/users.service");
let PrivySyncController = class PrivySyncController {
    constructor(privyAuthService, usersService) {
        this.privyAuthService = privyAuthService;
        this.usersService = usersService;
    }
    async createUserInPrivy(body) {
        try {
            console.log('🔄 Creating user in Privy:', body);
            if (!body.privyId || !body.username) {
                throw new common_1.HttpException('privyId and username are required', common_1.HttpStatus.BAD_REQUEST);
            }
            const existingUser = await this.usersService.findByPrivyId(body.privyId);
            if (existingUser) {
                console.log('✅ User already exists in database:', body.privyId);
                return { success: true, message: 'User already exists', user: existingUser };
            }
            const userData = {
                privyId: body.privyId,
                username: body.username,
                points: 0,
                isFlagged: 0,
                submissions: [],
                comments: [],
                upvotedSubmissions: [],
                jobs: [],
                replies: []
            };
            const newUser = await this.usersService.create(userData);
            console.log('✅ User created in database:', newUser);
            try {
                const privyUser = await this.privyAuthService.getUserFromPrivy(body.privyId);
                console.log('✅ User verified in Privy:', privyUser);
            }
            catch (error) {
                console.log('⚠️ Could not verify with Privy API (this is okay):', error.message);
            }
            return {
                success: true,
                message: 'User created successfully',
                user: newUser
            };
        }
        catch (error) {
            console.error('❌ Error creating user:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async testConnection() {
        return {
            success: true,
            message: 'Sync endpoint is working',
            timestamp: new Date().toISOString(),
            privyConfigured: !!process.env.PRIVY_API_KEY
        };
    }
    async healthCheck() {
        try {
            const userCount = await this.usersService.findAll();
            const dbStatus = { connected: true, userCount: userCount.length };
            const privyStatus = {
                apiKeyConfigured: !!process.env.PRIVY_API_KEY,
                appIdConfigured: !!process.env.PRIVY_APP_ID,
                appId: process.env.PRIVY_APP_ID || 'cm4g4hzw102g3hlf5jgx0rxf9'
            };
            return {
                success: true,
                timestamp: new Date().toISOString(),
                database: dbStatus,
                privy: privyStatus,
                environment: {
                    nodeEnv: process.env.NODE_ENV,
                    port: process.env.PORT || 3000
                }
            };
        }
        catch (error) {
            console.error('Health check failed:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
};
exports.PrivySyncController = PrivySyncController;
__decorate([
    (0, common_1.Post)('create-user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivySyncController.prototype, "createUserInPrivy", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrivySyncController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrivySyncController.prototype, "healthCheck", null);
exports.PrivySyncController = PrivySyncController = __decorate([
    (0, common_1.Controller)('sync'),
    __metadata("design:paramtypes", [privy_auth_service_1.PrivyAuthService,
        users_service_1.UsersService])
], PrivySyncController);
//# sourceMappingURL=privy-sync.controller.js.map