import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Reply extends Document {
  @Prop({ type: String, required: true })
  reply: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment', required: false })
  commentId: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Reply', default: null })
  parentReply: ObjectId;

  @Prop({ type: Number, required: false })
  points: number;

  @Prop({ type: String, required: false })
  createdAt: string;

  @Prop({ type: String, required: false })
  author: string;

  @Prop({ type: [Types.ObjectId], ref: 'Reply', required: false, default: [] })
  replies: Types.ObjectId[];

  @Prop({ type: Number, required: false })
  isFlagged: number;

  @Prop({ type: String, required: false })
  category: string;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
