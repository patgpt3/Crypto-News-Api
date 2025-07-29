import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: false })
  password: string;

  @Prop({ type: String, required: false, unique: true, sparse: true })
  privyId: string; // Add Privy ID field

  @Prop({ type: String, required: false })
  about: string;

  @Prop({ type: String, required: false })
  email: string;

  @Prop({ type: Number, required: false })
  isFlagged: number;

  @Prop({ type: Number, required: false })
  points: number;

  @Prop({ type: Array, required: false })
  submissions: string[];

  @Prop({ type: Array, required: false })
  comments: string[];

  @Prop({ type: Array, required: false })
  upvotedSubmissions: string[];
  @Prop({ type: Array, required: false })
  jobs: string[];
  @Prop({ type: Array, required: false })
  replies: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
