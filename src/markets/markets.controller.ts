import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MarketsService } from './markets.service';

@Controller('markets')
export class MarketsController {
  constructor(private readonly markets: MarketsService) {}

  @Get()
  async list(@Query('q') q?: string) {
    return this.markets.list(q);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.markets.get(id);
  }

  @Post()
  async create(@Body() body: { question: string; description?: string; outcomes: string[]; author?: string; }) {
    return this.markets.create(body);
  }

  @Post(':id/bet')
  async bet(
    @Param('id') id: string,
    @Body() body: { outcomeId: string; amount: number; userId?: string },
  ) {
    return this.markets.placeBet(id, body);
  }

  @Get(':id/positions')
  async positions(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.markets.listPositions(id, userId);
  }
}


