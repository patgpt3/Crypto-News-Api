import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MemesService } from './memes.service';

@Controller('memes')
export class MemesController {
  constructor(private readonly memes: MemesService) {}

  @Get()
  async list(
    @Query('category') category?: string,
    @Query('sort') sort?: 'top'|'new',
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    return this.memes.list(category, (sort as any) || 'top', limit ? parseInt(limit) : 30, page ? parseInt(page) : 0);
  }

  @Post()
  async create(@Body() body: { title: string; imageUrl: string; sourceUrl?: string; category: string; createdBy?: string; }) {
    if (!body?.title || !body?.imageUrl || !body?.category) throw new Error('Missing fields');
    return this.memes.create(body);
  }

  @Post(':id/upvote')
  async upvote(@Param('id') id: string) {
    return this.memes.upvote(id);
  }
}


