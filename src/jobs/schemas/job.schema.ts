import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: false })
  text: string;

  @Prop({ type: Number, required: true })
  isFlagged: number;

  @Prop({ type: String, required: false })
  author: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
