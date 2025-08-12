import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MarketsService } from './markets.service';

@Controller('markets')
export class MarketsController {
  constructor(private readonly markets: MarketsService) {}

  @Get()
  async list(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: 'top' | 'new',
  ) {
    return this.markets.list(q, category, sort);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.markets.get(id);
  }

  @Post()
  async create(@Body() body: { category: string; question: string; description?: string; outcomes: string[]; author?: string; }) {
    if (!body?.category) {
      throw new Error('category is required');
    }
    body.category = body.category.toLowerCase();
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

  @Post(':id/upvote')
  async upvote(@Param('id') id: string) {
    return this.markets.upvote(id);
  }
}


