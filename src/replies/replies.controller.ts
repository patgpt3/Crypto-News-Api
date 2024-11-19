import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Inject,
  Put,
  Delete,
} from '@nestjs/common';
import { ReplyDTO } from './dto/reply.dto';
import { RepliesService } from './replies.service';
import { Reply } from './interfaces/replies.interface';
import { LoggerService } from 'src/logger/logger.service';
@Controller('replies')
export class RepliesController {
  constructor(
    @Inject(RepliesService) private repliesService: RepliesService,
    private logger: LoggerService,
  ) {}

  @Get()
  async findAll(): Promise<Reply[]> {
    this.logger.debug('Get All Replies Endpoint');
    const fa = await this.repliesService.findAll();
    return fa;
  }

  @Get(':id')
  async findById(@Param() param): Promise<Reply> {
    this.logger.debug('Get Reply by ID Endpoint');
    return this.repliesService.findById(param.id);
  }

  @Get('replies/nested/:id')
  async getReplyWithNestedReplies(@Param() param): Promise<Reply> {
    this.logger.debug('Get Reply with Replies Endpoint');
    return this.repliesService.getReplyWithNestedReplies(param.id);
  }

  @Post('replies/findbyIds')
  async findbyIds(@Body() idsObj: { replies: string[] }): Promise<Reply[]> {
    this.logger.debug('Get All Replies by Ids Endpoint');
    const results = [];

    const ids = idsObj.replies;
    console.log(ids);

    for (const id of ids) {
      try {
        console.log(id);
        const data = await this.repliesService.getReplyWithNestedReplies(id);
        console.log(data);
        results.push(data);
      } catch (error) {
        console.error(`Error fetching data for ID ${id}:`, error);
      }
    }

    return results;
  }

  @Post()
  async create(@Body() replyDTO: ReplyDTO): Promise<Reply> {
    this.logger.debug('Create Reply Endpoint');
    const createI = await this.repliesService.create(replyDTO);
    return createI;
  }
  @Put(':id')
  async update(@Param() param, @Body() replyDTO: ReplyDTO): Promise<Reply> {
    this.logger.debug('Update Replies Endpoint');
    return this.repliesService.update(param.id, replyDTO);
  }

  @Delete(':id')
  async delete(@Param() param): Promise<Reply> {
    this.logger.debug('Delete Reply Endpoint');
    return this.repliesService.delete(param.id);
  }

  @Put('upVote/:id')
  async upVote(
    @Param() param,
    @Body() currentUser: { currentUserName: string },
  ): Promise<Reply> {
    this.logger.debug('Up Vote Reply Endpoint');
    const fa = await this.repliesService.upVote(param.id, currentUser);
    return fa;
  }

  @Put('downVote/:id')
  async downVote(
    @Param() param,
    @Body() currentUser: { currentUserName: string },
  ): Promise<Reply> {
    this.logger.debug('Down Vote Reply Endpoint');
    const fa = await this.repliesService.downVote(param.id, currentUser);
    return fa;
  }
}
