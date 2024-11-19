import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentSchema } from './schemas/comment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from 'src/logger/logger.service';
import { ItemsService } from 'src/items/items.service';
import { UsersService } from 'src/Users/users.service';
import { UserSchema } from 'src/Users/schemas/user.schema';
import { ItemSchema } from 'src/items/schemas/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, LoggerService, UsersService, ItemsService],
})
export class CommentsModule {}
