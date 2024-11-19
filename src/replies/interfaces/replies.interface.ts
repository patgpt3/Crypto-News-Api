import { ObjectId } from 'mongoose';

export interface Reply {
  reply?: string;
  commentId?: ObjectId;
  parentReply?: ObjectId;
  points?: number;
  createdAt?: Date;
  author?: string;
  replies?: any[];
  isFlagged?: number;
}
