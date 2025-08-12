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
exports.MarketsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MarketsService = class MarketsService {
    constructor(marketModel, positionModel) {
        this.marketModel = marketModel;
        this.positionModel = positionModel;
    }
    async list(q) {
        const where = q
            ? { $or: [
                    { question: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } },
                ] }
            : {};
        return this.marketModel.find(where).sort({ createdAt: -1 }).lean();
    }
    async get(id) {
        const m = await this.marketModel.findById(id).lean();
        if (!m)
            throw new common_1.NotFoundException('Market not found');
        return m;
    }
    async create(input) {
        const outcomes = (input.outcomes || []).filter(Boolean).map(label => ({ label, probability: 1 / Math.max(2, input.outcomes.length) }));
        const created = await this.marketModel.create({
            question: input.question.trim(),
            description: input.description?.trim(),
            outcomes,
            volume: 0,
            createdAt: new Date(),
            resolved: false,
            author: input.author,
        });
        return created.toObject();
    }
    async placeBet(marketId, params) {
        const market = await this.marketModel.findById(marketId);
        if (!market)
            throw new common_1.NotFoundException('Market not found');
        if (market.resolved)
            throw new Error('Market is resolved');
        const idx = market.outcomes.findIndex(o => o._id?.toString() === params.outcomeId);
        if (idx === -1)
            throw new common_1.NotFoundException('Outcome not found');
        const k = 0.02;
        const outcome = market.outcomes[idx];
        const delta = Math.tanh(k * params.amount) * (1 - outcome.probability);
        outcome.probability = Math.min(0.99, Math.max(0.01, outcome.probability + delta));
        const othersTotal = market.outcomes.filter((_, i) => i !== idx).reduce((s, o) => s + o.probability, 0);
        const remaining = 1 - outcome.probability;
        market.outcomes = market.outcomes.map((o, i) => i === idx ? outcome : { ...o, probability: (o.probability / othersTotal) * remaining });
        market.volume += params.amount;
        await market.save();
        const price = outcome.probability;
        const pos = await this.positionModel.findOne({ marketId, outcomeId: params.outcomeId, userId: params.userId || null });
        const addShares = params.amount / Math.max(0.01, price);
        if (!pos) {
            await this.positionModel.create({
                marketId,
                outcomeId: params.outcomeId,
                userId: params.userId || null,
                shares: addShares,
                avgPrice: price,
                updatedAt: new Date(),
            });
        }
        else {
            const totalCost = pos.avgPrice * pos.shares + price * addShares;
            const totalShares = pos.shares + addShares;
            pos.shares = totalShares;
            pos.avgPrice = totalCost / totalShares;
            pos.updatedAt = new Date();
            await pos.save();
        }
        return { price };
    }
    async listPositions(marketId, userId) {
        const where = { marketId };
        if (userId)
            where.userId = userId;
        return this.positionModel.find(where).lean();
    }
};
exports.MarketsService = MarketsService;
exports.MarketsService = MarketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Market')),
    __param(1, (0, mongoose_1.InjectModel)('Position')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MarketsService);
//# sourceMappingURL=markets.service.js.map