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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const privy_auth_service_1 = require("../auth/privy-auth.service");
let UsersService = class UsersService {
    constructor(userModel, privyAuthService) {
        this.userModel = userModel;
        this.privyAuthService = privyAuthService;
    }
    async findAll() {
        const findAllI = await this.userModel.find().exec();
        return findAllI;
    }
    async findAllProtected() {
        const findAllI = await this.userModel.find({}, { password: 0 }).exec();
        return findAllI;
    }
    async findById(id) {
        return id.match(/^[0-9a-fA-F]{24}$/)
            ? await this.userModel.findOne({ _id: id })
            : null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return await this.userModel.findOne({ _id: id });
        }
    }
    async findByUsername(Username) {
        const findUser = await this.userModel.findOne({ username: Username });
        return findUser;
        if (Username.match(Username)) {
            return await this.userModel.findOne({ username: Username });
        }
    }
    async findByUsernameProtected(Username) {
        const findUser = await this.userModel.findOne({ username: Username });
        const returnUser = findUser.toJSON();
        const { password, ...rest } = returnUser;
        return rest;
        if (Username.match(Username)) {
            return await this.userModel.findOne({ username: Username });
        }
    }
    async findByPrivyId(privyId) {
        const findUser = await this.userModel.findOne({ privyId: privyId });
        return findUser;
    }
    async create(user) {
        const existingUser = await this.findByUsername(user.username);
        if (existingUser) {
            throw new Error('Username already exists');
        }
        const existingPrivyUser = await this.findByPrivyId(user.privyId);
        if (existingPrivyUser) {
            throw new Error('User already exists with this wallet');
        }
        const newUser = await new this.userModel(user);
        return newUser.save();
    }
    async delete(id) {
        return this.userModel.findByIdAndDelete(id);
    }
    async update(id, user) {
        return await this.userModel.findByIdAndUpdate(id, user, { new: true });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        privy_auth_service_1.PrivyAuthService])
], UsersService);
//# sourceMappingURL=users.service.js.map