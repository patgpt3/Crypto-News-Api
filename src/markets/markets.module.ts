import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';
import { MarketSchema } from './schemas/market.schema';
import { PositionSchema } from './schemas/position.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Market', schema: MarketSchema }]),
    MongooseModule.forFeature([{ name: 'Position', schema: PositionSchema }]),
  ],
  controllers: [MarketsController],
  providers: [MarketsService],
})
export class MarketsModule {}


