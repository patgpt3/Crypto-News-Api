import { Schema } from 'mongoose';

export const OutcomeSchema = new Schema(
  {
    label: { type: String, required: true },
    probability: { type: Number, required: true, min: 0, max: 1 },
  },
  { _id: true }
);

const CATEGORY_VALUES = [
  'crypto',
  'ai',
  'memecoins',
  'depin',
  'nft',
  'desci',
  'film',
  'gaming',
] as const;

export const MarketSchema = new Schema(
  {
    category: { type: String, required: true, enum: CATEGORY_VALUES },
    question: { type: String, required: true },
    description: { type: String },
    outcomes: { type: [OutcomeSchema], required: true },
    volume: { type: Number, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
    resolved: { type: Boolean, default: false },
    winningOutcomeId: { type: String },
    author: { type: String },
  },
  { collection: 'markets' }
);

// Indexes to keep category queries fast and avoid cross-category bleed in listings
MarketSchema.index({ category: 1, createdAt: -1 });
MarketSchema.index({ category: 1, question: 1 });

export { CATEGORY_VALUES };


