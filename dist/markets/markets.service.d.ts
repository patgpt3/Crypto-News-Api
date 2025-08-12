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
export declare class MarketsService {
    private readonly marketModel;
    private readonly positionModel;
    constructor(marketModel: Model<MarketDoc>, positionModel: Model<PositionDoc>);
    list(q?: string, category?: string, sort?: 'top' | 'new'): Promise<(import("mongoose").FlattenMaps<MarketDoc> & Required<{
        _id: string;
    }>)[]>;
    get(id: string): Promise<import("mongoose").FlattenMaps<MarketDoc> & Required<{
        _id: string;
    }>>;
    create(input: {
        category: string;
        question: string;
        description?: string;
        outcomes: string[];
        author?: string;
    }): Promise<MarketDoc & Required<{
        _id: string;
    }>>;
    upvote(id: string): Promise<{
        ok: boolean;
        points: any;
    }>;
    placeBet(marketId: string, params: {
        outcomeId: string;
        amount: number;
        userId?: string;
    }): Promise<{
        price: any;
    }>;
    listPositions(marketId: string, userId?: string): Promise<(import("mongoose").FlattenMaps<PositionDoc> & Required<{
        _id: string;
    }>)[]>;
}
