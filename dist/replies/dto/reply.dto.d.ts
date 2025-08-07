import { ObjectId } from 'mongoose';
export declare class ReplyDTO {
    readonly reply?: string;
    readonly commentId?: ObjectId;
    readonly parentReply?: ObjectId;
    readonly points?: number;
    readonly createdAt?: Date;
    readonly author?: string;
    readonly replies?: ObjectId[];
    readonly isFlagged?: number;
}
