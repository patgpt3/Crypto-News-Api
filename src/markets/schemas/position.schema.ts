import { Schema } from 'mongoose';

export const PositionSchema = new Schema(
  {
    marketId: { type: String, required: true, index: true },
    outcomeId: { type: String, required: true },
    userId: { type: String, default: null, index: true },
    shares: { type: Number, required: true },
    avgPrice: { type: Number, required: true },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { collection: 'positions' }
);


