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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_dto_1 = require("./dto/users.dto");
const logger_service_1 = require("../logger/logger.service");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService, logger) {
        this.usersService = usersService;
        this.logger = logger;
    }
    async findAll() {
        this.logger.debug('Get All users Endpoint');
        const fa = await this.usersService.findAll();
        return fa;
    }
    async findAllProtected() {
        this.logger.debug('Get All users protexted Endpoint');
        const fa = await this.usersService.findAllProtected();
        return fa;
    }
    async findById(param) {
        this.logger.debug('Get User by ID Endpoint');
        return this.usersService.findById(param.id);
    }
    async findByUsername(param) {
        this.logger.debug('Get User by username Endpoint');
        return this.usersService.findByUsername(param.username);
    }
    async findByUsernameProtected(param) {
        this.logger.debug('Get User by username Endpoint');
        return this.usersService.findByUsernameProtected(param.username);
    }
    async findByPrivyId(param) {
        this.logger.debug('Get User by Privy ID Endpoint');
        return this.usersService.findByPrivyId(param.privyId);
    }
    async create(userDTO) {
        this.logger.debug('Create User Endpoint');
        const createI = await this.usersService.create(userDTO);
        return createI;
    }
    async update(param, userDTO) {
        this.logger.debug('Update users Endpoint');
        return this.usersService.update(param.id, userDTO);
    }
    async delete(param) {
        this.logger.debug('Delete User Endpoint');
        return this.usersService.delete(param.id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAllProtected", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('find/:username'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByUsername", null);
__decorate([
    (0, common_1.Get)('findProtected/:username'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByUsernameProtected", null);
__decorate([
    (0, common_1.Get)('find/privy/:privyId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByPrivyId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.UserDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_dto_1.UserDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __param(0, (0, common_1.Inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        logger_service_1.LoggerService])
], UsersController);
//# sourceMappingURL=users.controller.js.map