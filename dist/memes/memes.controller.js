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
exports.MemesController = void 0;
const common_1 = require("@nestjs/common");
const memes_service_1 = require("./memes.service");
let MemesController = class MemesController {
    constructor(memes) {
        this.memes = memes;
    }
    async list(category, sort, limit, page) {
        return this.memes.list(category, sort || 'top', limit ? parseInt(limit) : 30, page ? parseInt(page) : 0);
    }
    async create(body) {
        if (!body?.title || !body?.imageUrl || !body?.category)
            throw new Error('Missing fields');
        return this.memes.create(body);
    }
    async upvote(id) {
        return this.memes.upvote(id);
    }
};
exports.MemesController = MemesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('sort')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], MemesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/upvote'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemesController.prototype, "upvote", null);
exports.MemesController = MemesController = __decorate([
    (0, common_1.Controller)('memes'),
    __metadata("design:paramtypes", [memes_service_1.MemesService])
], MemesController);
//# sourceMappingURL=memes.controller.js.map