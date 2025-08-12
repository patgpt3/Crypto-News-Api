import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemesController } from './memes.controller';
import { MemesService } from './memes.service';
import { MemeSchema } from './schemas/meme.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Meme', schema: MemeSchema }])],
  controllers: [MemesController],
  providers: [MemesService],
})
export class MemesModule {}


