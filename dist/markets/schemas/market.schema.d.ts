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
declare const CATEGORY_VALUES: readonly ["crypto", "ai", "memecoins", "depin", "nft", "desci", "film", "gaming"];
export declare const MarketSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    category: "crypto" | "ai" | "memecoins" | "depin" | "nft" | "desci" | "film" | "gaming";
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
    category: "crypto" | "ai" | "memecoins" | "depin" | "nft" | "desci" | "film" | "gaming";
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
    category: "crypto" | "ai" | "memecoins" | "depin" | "nft" | "desci" | "film" | "gaming";
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
export { CATEGORY_VALUES };
