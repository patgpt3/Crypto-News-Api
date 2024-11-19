import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { ReplySchema } from './schemas/reply.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from 'src/logger/logger.service';
import { UserSchema } from 'src/Users/schemas/user.schema';
import { CommentSchema } from 'src/comments/schemas/comment.schema';
import { UsersService } from 'src/Users/users.service';
import { CommentsService } from 'src/comments/comments.service';
import { ItemSchema } from 'src/items/schemas/item.schema';
import { ItemsService } from 'src/items/items.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reply', schema: ReplySchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
  ],
  controllers: [RepliesController],
  providers: [
    RepliesService,
    LoggerService,
    UsersService,
    CommentsService,
    ItemsService,
  ],
})
export class RepliesModule {}
