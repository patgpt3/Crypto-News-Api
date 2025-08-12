"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketSchema = exports.OutcomeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.OutcomeSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    probability: { type: Number, required: true, min: 0, max: 1 },
}, { _id: true });
exports.MarketSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    description: { type: String },
    outcomes: { type: [exports.OutcomeSchema], required: true },
    volume: { type: Number, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
    resolved: { type: Boolean, default: false },
    winningOutcomeId: { type: String },
    author: { type: String },
}, { collection: 'markets' });
//# sourceMappingURL=market.schema.js.map