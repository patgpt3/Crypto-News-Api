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
exports.MemesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MemesService = class MemesService {
    constructor(memeModel) {
        this.memeModel = memeModel;
    }
    async list(category, sort = 'top', limit = 30, page = 0) {
        const where = {};
        if (category)
            where.category = category.toLowerCase();
        const order = sort === 'new' ? { createdAt: -1 } : { points: -1, createdAt: -1 };
        return this.memeModel.find(where).sort(order).skip(page * limit).limit(limit).lean();
    }
    async create(body) {
        const created = await this.memeModel.create({
            title: body.title.trim(),
            imageUrl: body.imageUrl,
            sourceUrl: body.sourceUrl,
            category: body.category.toLowerCase(),
            createdBy: body.createdBy,
            createdAt: new Date(),
            points: 0,
        });
        return created.toObject();
    }
    async upvote(id) {
        const updated = await this.memeModel.findByIdAndUpdate(id, { $inc: { points: 1 } }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException('Meme not found');
        return { ok: true, points: updated.points };
    }
};
exports.MemesService = MemesService;
exports.MemesService = MemesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Meme')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MemesService);
//# sourceMappingURL=memes.service.js.map