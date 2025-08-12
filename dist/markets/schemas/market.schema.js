"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_VALUES = exports.MarketSchema = exports.OutcomeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.OutcomeSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    probability: { type: Number, required: true, min: 0, max: 1 },
}, { _id: true });
const CATEGORY_VALUES = [
    'crypto',
    'ai',
    'memecoins',
    'depin',
    'nft',
    'desci',
    'film',
    'gaming',
];
exports.CATEGORY_VALUES = CATEGORY_VALUES;
exports.MarketSchema = new mongoose_1.Schema({
    category: { type: String, required: true, enum: CATEGORY_VALUES },
    question: { type: String, required: true },
    description: { type: String },
    outcomes: { type: [exports.OutcomeSchema], required: true },
    volume: { type: Number, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
    resolved: { type: Boolean, default: false },
    winningOutcomeId: { type: String },
    author: { type: String },
    points: { type: Number, default: 0 },
}, { collection: 'markets' });
exports.MarketSchema.index({ category: 1, createdAt: -1 });
exports.MarketSchema.index({ category: 1, question: 1 });
exports.MarketSchema.index({ category: 1, points: -1, createdAt: -1 });
//# sourceMappingURL=market.schema.js.map