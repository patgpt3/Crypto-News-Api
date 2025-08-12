import { Schema } from 'mongoose';
export declare const OutcomeSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: true;
}, {
    label: string;
    probability: number;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    label: string;
    probability: number;
}>> & import("mongoose").FlatRecord<{
    label: string;
    probability: number;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const MarketSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    createdAt: Date;
    question: string;
    outcomes: import("mongoose").Types.DocumentArray<{
        label: string;
        probability: number;
    }>;
    volume: number;
    resolved: boolean;
    author?: string;
    description?: string;
    winningOutcomeId?: string;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: Date;
    question: string;
    outcomes: import("mongoose").Types.DocumentArray<{
        label: string;
        probability: number;
    }>;
    volume: number;
    resolved: boolean;
    author?: string;
    description?: string;
    winningOutcomeId?: string;
}>> & import("mongoose").FlatRecord<{
    createdAt: Date;
    question: string;
    outcomes: import("mongoose").Types.DocumentArray<{
        label: string;
        probability: number;
    }>;
    volume: number;
    resolved: boolean;
    author?: string;
    description?: string;
    winningOutcomeId?: string;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
