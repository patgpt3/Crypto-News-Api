import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface OutcomeDoc {
  _id: string;
  label: string;
  probability: number;
}

export interface MarketDoc {
  _id: string;
  question: string;
  description?: string;
  outcomes: OutcomeDoc[];
  volume: number;
  createdAt: Date;
  resolved: boolean;
  winningOutcomeId?: string;
  author?: string;
}

export interface PositionDoc {
  _id: string;
  marketId: string;
  outcomeId: string;
  userId?: string;
  shares: number;
  avgPrice: number;
  updatedAt: Date;
}

@Injectable()
export class MarketsService {
  constructor(
    @InjectModel('Market') private readonly marketModel: Model<MarketDoc>,
    @InjectModel('Position') private readonly positionModel: Model<PositionDoc>,
  ) {}

  async list(q?: string) {
    const where = q
      ? { $or: [
          { question: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ] }
      : {};
    return this.marketModel.find(where).sort({ createdAt: -1 }).lean();
  }

  async get(id: string) {
    const m = await this.marketModel.findById(id).lean();
    if (!m) throw new NotFoundException('Market not found');
    return m;
  }

  async create(input: { question: string; description?: string; outcomes: string[]; author?: string }) {
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

  async placeBet(marketId: string, params: { outcomeId: string; amount: number; userId?: string }) {
    const market = await this.marketModel.findById(marketId);
    if (!market) throw new NotFoundException('Market not found');
    if (market.resolved) throw new Error('Market is resolved');
    const idx = market.outcomes.findIndex(o => (o as any)._id?.toString() === params.outcomeId);
    if (idx === -1) throw new NotFoundException('Outcome not found');

    const k = 0.02;
    const outcome = market.outcomes[idx] as any;
    const delta = Math.tanh(k * params.amount) * (1 - outcome.probability);
    outcome.probability = Math.min(0.99, Math.max(0.01, outcome.probability + delta));
    const othersTotal = market.outcomes.filter((_, i) => i !== idx).reduce((s: number, o: any) => s + o.probability, 0);
    const remaining = 1 - outcome.probability;
    market.outcomes = market.outcomes.map((o: any, i: number) => i === idx ? outcome : { ...o, probability: (o.probability / othersTotal) * remaining });
    market.volume += params.amount;
    await market.save();

    // position upsert
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
    } else {
      const totalCost = pos.avgPrice * pos.shares + price * addShares;
      const totalShares = pos.shares + addShares;
      pos.shares = totalShares;
      pos.avgPrice = totalCost / totalShares;
      pos.updatedAt = new Date();
      await pos.save();
    }

    return { price };
  }

  async listPositions(marketId: string, userId?: string) {
    const where: any = { marketId };
    if (userId) where.userId = userId;
    return this.positionModel.find(where).lean();
  }
}


