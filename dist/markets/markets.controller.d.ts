import { MarketsService } from './markets.service';
export declare class MarketsController {
    private readonly markets;
    constructor(markets: MarketsService);
    list(q?: string): Promise<(import("mongoose").FlattenMaps<import("./markets.service").MarketDoc> & Required<{
        _id: string;
    }>)[]>;
    get(id: string): Promise<import("mongoose").FlattenMaps<import("./markets.service").MarketDoc> & Required<{
        _id: string;
    }>>;
    create(body: {
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
}
