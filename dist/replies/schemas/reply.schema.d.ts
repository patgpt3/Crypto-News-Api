import { ObjectId } from 'mongodb';
import { Document, Types } from 'mongoose';
export declare class Reply extends Document {
    reply: string;
    commentId: ObjectId;
    parentReply: ObjectId;
    points: number;
    createdAt: string;
    author: string;
    replies: Types.ObjectId[];
    isFlagged: number;
    category: string;
}
export declare const ReplySchema: import("mongoose").Schema<Reply, import("mongoose").Model<Reply, any, any, any, Document<unknown, any, Reply> & Reply & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reply, Document<unknown, {}, import("mongoose").FlatRecord<Reply>> & import("mongoose").FlatRecord<Reply> & {
    _id: Types.ObjectId;
}>;
