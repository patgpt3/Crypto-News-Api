"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.MemeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    sourceUrl: { type: String },
    category: { type: String, required: true, index: true },
    points: { type: Number, default: 0, index: true },
    createdBy: { type: String },
    createdAt: { type: Date, default: () => new Date() },
}, { collection: 'memes' });
exports.MemeSchema.index({ category: 1, points: -1, createdAt: -1 });
exports.MemeSchema.index({ category: 1, createdAt: -1 });
//# sourceMappingURL=meme.schema.js.map