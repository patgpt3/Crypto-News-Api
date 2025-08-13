import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: String, required: true })
  item: string;

  @Prop({ type: Number, required: true })
  points: number;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: Array, required: true })
  replies: string[];

  @Prop({ type: Number, required: true })
  isFlagged: number;

  @Prop({ type: String, required: false })
  category: string;

  // normalized dedupe key of comment text
  @Prop({ type: String, required: false, index: true })
  commentHash?: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
// prevent exact duplicate comments per item+author
CommentSchema.index({ item: 1, author: 1, commentHash: 1 }, { unique: true, sparse: true });
