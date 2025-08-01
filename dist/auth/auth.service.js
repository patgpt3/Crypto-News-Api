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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
const users_service_1 = require("../Users/users.service");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(usersService, logger, jwtService) {
        this.usersService = usersService;
        this.logger = logger;
        this.jwtService = jwtService;
    }
    async validateUser(username, password) {
        this.logger.debug('Validate User Endpoint');
        const user = await this.usersService.findByUsername(username);
        const hash = await bcrypt.hash(user.password, 10);
        const comp = await bcrypt.compare(password, hash);
        if (user && comp) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            username: user.username,
            sub: {
                name: user.username,
            },
        };
        const { password, ...result } = user;
        return {
            ...result,
            accesstoken: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "validateUser", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        logger_service_1.LoggerService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map