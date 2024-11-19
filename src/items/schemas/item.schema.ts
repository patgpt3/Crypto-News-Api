import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { Comment, CommentSchema } from 'src/comments/schemas/comment.schema';
// import { User, UserSchema } from 'src/Users/schemas/user.schema';

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  url: string;

  @Prop({ type: String, required: false })
  text: string;

  @Prop({ type: Number, required: true })
  points: number;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: Array, required: false })
  comments: string[];

  @Prop({ type: Number, required: true })
  isFlagged: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
