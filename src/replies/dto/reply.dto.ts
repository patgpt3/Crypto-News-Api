import { ObjectId } from 'mongoose';

export class ReplyDTO {
  readonly reply?: string;
  readonly commentId?: ObjectId;
  readonly parentReply?: ObjectId;
  readonly points?: number;
  readonly createdAt?: Date;
  readonly author?: string;
  readonly replies?: any[];
  readonly isFlagged?: number;
}
