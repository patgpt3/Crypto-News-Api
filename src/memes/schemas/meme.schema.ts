import { Schema } from 'mongoose';

export const MemeSchema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    sourceUrl: { type: String },
    category: { type: String, required: true, index: true },
    points: { type: Number, default: 0, index: true },
    createdBy: { type: String },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: 'memes' }
);

MemeSchema.index({ category: 1, points: -1, createdAt: -1 });
MemeSchema.index({ category: 1, createdAt: -1 });


