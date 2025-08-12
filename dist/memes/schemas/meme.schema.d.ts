import { Schema } from 'mongoose';
export declare const MemeSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    collection: string;
}, {
    points: number;
    category: string;
    createdAt: Date;
    title: string;
    imageUrl: string;
    sourceUrl?: string;
    createdBy?: string;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    points: number;
    category: string;
    createdAt: Date;
    title: string;
    imageUrl: string;
    sourceUrl?: string;
    createdBy?: string;
}>> & import("mongoose").FlatRecord<{
    points: number;
    category: string;
    createdAt: Date;
    title: string;
    imageUrl: string;
    sourceUrl?: string;
    createdBy?: string;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
