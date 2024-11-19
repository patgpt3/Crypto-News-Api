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
import { CommentDTO } from './dto/comment.dto';
import { CommentsService } from './comments.service';
import { Comment } from './interfaces/comment.interface';
import { LoggerService } from 'src/logger/logger.service';
@Controller('comments')
export class CommentsController {
  constructor(
    @Inject(CommentsService) private commentsService: CommentsService,
    private logger: LoggerService,
  ) {}

  @Get()
  async findAll(): Promise<Comment[]> {
    this.logger.debug('Get All Comments Endpoint');
    const fa = await this.commentsService.findAll();
    return fa;
  }

  @Get(':id')
  async findById(@Param() param): Promise<Comment> {
    this.logger.debug('Get Comment by ID Endpoint');
    return this.commentsService.findById(param.id);
  }

  @Get('comments/newest')
  async findAllNewest(): Promise<Comment[]> {
    this.logger.debug('Get All Newest Comments Endpoint');
    const fa = await this.commentsService.findAllNewest();
    return fa;
  }

  @Put('comments/newest/pages')
  async findAllNewestPagination(
    @Param() param,
    @Body() page: { pageNumber: number },
  ): Promise<Comment[]> {
    this.logger.debug('Get All New Comments Pages Endpoint');
    const fa = await this.commentsService.findAllNewestPagination(
      page.pageNumber,
    );
    return fa;
  }

  @Post('comments/findbyIds')
  async findbyIds(@Body() idsObj: { comments: string[] }): Promise<Comment[]> {
    this.logger.debug('Get All Comments by Ids Endpoint');
    const results = [];

    const ids = idsObj.comments;
    console.log(ids);

    for (const id of ids) {
      try {
        console.log(id);
        const data = await this.commentsService.findById(id);
        console.log(data);
        results.push(data);
      } catch (error) {
        console.error(`Error fetching data for ID ${id}:`, error);
      }
    }

    return results;
  }

  @Post()
  async create(@Body() commentDTO: CommentDTO): Promise<Comment> {
    this.logger.debug('Create Comment Endpoint');
    const createI = await this.commentsService.create(commentDTO);
    return createI;
  }
  @Put(':id')
  async update(
    @Param() param,
    @Body() commentDTO: CommentDTO,
  ): Promise<Comment> {
    this.logger.debug('Update Comments Endpoint');
    return this.commentsService.update(param.id, commentDTO);
  }
  @Put('upVote/:id')
  async upVote(
    @Param() param,
    @Body() currentUser: { currentUserName: string },
  ): Promise<Comment> {
    this.logger.debug('Up Vote Comment Endpoint');
    const fa = await this.commentsService.upVote(param.id, currentUser);
    return fa;
  }

  @Put('downVote/:id')
  async downVote(
    @Param() param,
    @Body() currentUser: { currentUserName: string },
  ): Promise<Comment> {
    this.logger.debug('Down Vote Comment Endpoint');
    const fa = await this.commentsService.downVote(param.id, currentUser);
    return fa;
  }
  @Delete(':id')
  async delete(@Param() param): Promise<Comment> {
    this.logger.debug('Delete Comment Endpoint');
    return this.commentsService.delete(param.id);
  }
}
