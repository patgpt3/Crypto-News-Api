import { Schema } from 'mongoose';

export const OutcomeSchema = new Schema(
  {
    label: { type: String, required: true },
    probability: { type: Number, required: true, min: 0, max: 1 },
  },
  { _id: true }
);

export const MarketSchema = new Schema(
  {
    category: { type: String, required: true },
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


