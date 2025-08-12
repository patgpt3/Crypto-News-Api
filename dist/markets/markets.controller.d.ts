import { MarketsService } from './markets.service';
export declare class MarketsController {
    private readonly markets;
    constructor(markets: MarketsService);
    list(q?: string, category?: string, sort?: 'top' | 'new'): Promise<(import("mongoose").FlattenMaps<import("./markets.service").MarketDoc> & Required<{
        _id: string;
    }>)[]>;
    get(id: string): Promise<import("mongoose").FlattenMaps<import("./markets.service").MarketDoc> & Required<{
        _id: string;
    }>>;
    create(body: {
        category: string;
        question: string;
        description?: string;
        outcomes: string[];
        author?: string;
    }): Promise<import("./markets.service").MarketDoc & Required<{
        _id: string;
    }>>;
    bet(id: string, body: {
        outcomeId: string;
        amount: number;
        userId?: string;
    }): Promise<{
        price: any;
    }>;
    positions(id: string, userId?: string): Promise<(import("mongoose").FlattenMaps<import("./markets.service").PositionDoc> & Required<{
        _id: string;
    }>)[]>;
    upvote(id: string): Promise<{
        ok: boolean;
        points: any;
    }>;
}
