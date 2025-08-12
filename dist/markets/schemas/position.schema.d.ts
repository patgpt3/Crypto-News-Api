import { Schema } from 'mongoose';
export declare const PositionSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    updatedAt: Date;
    marketId: string;
    outcomeId: string;
    userId: string;
    shares: number;
    avgPrice: number;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    updatedAt: Date;
    marketId: string;
    outcomeId: string;
    userId: string;
    shares: number;
    avgPrice: number;
}>> & import("mongoose").FlatRecord<{
    updatedAt: Date;
    marketId: string;
    outcomeId: string;
    userId: string;
    shares: number;
    avgPrice: number;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
