import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './schemas/item.schema';
import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/Users/users.service';
import { UserSchema } from 'src/Users/schemas/user.schema';
import { CommentsService } from 'src/comments/comments.service';
import { CommentSchema } from 'src/comments/schemas/comment.schema';
// import { UsersService } from 'src/Users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService, LoggerService, UsersService, CommentsService],
})
export class ItemsModule {}
