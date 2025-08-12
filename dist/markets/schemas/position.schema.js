"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PositionSchema = new mongoose_1.Schema({
    marketId: { type: String, required: true, index: true },
    outcomeId: { type: String, required: true },
    userId: { type: String, default: null, index: true },
    shares: { type: Number, required: true },
    avgPrice: { type: Number, required: true },
    updatedAt: { type: Date, default: () => new Date() },
}, { collection: 'positions' });
//# sourceMappingURL=position.schema.js.map