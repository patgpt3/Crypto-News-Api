import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { ReplySchema } from './schemas/reply.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from 'src/logger/logger.service';
import { CommentSchema } from 'src/comments/schemas/comment.schema';
import { UsersModule } from 'src/Users/users.module';
import { CommentsService } from 'src/comments/comments.service';
import { ItemSchema } from 'src/items/schemas/item.schema';
import { ItemsService } from 'src/items/items.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reply', schema: ReplySchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    UsersModule, // Import UsersModule instead of directly providing UsersService
  ],
  controllers: [RepliesController],
  providers: [
    RepliesService,
    LoggerService,
    CommentsService,
    ItemsService,
  ],
})
export class RepliesModule {}
