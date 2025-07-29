import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './schemas/item.schema';
import { LoggerService } from 'src/logger/logger.service';
import { UsersModule } from 'src/Users/users.module';
import { CommentsService } from 'src/comments/comments.service';
import { CommentSchema } from 'src/comments/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    UsersModule, // Import UsersModule instead of directly providing UsersService
  ],
  controllers: [ItemsController],
  providers: [ItemsService, LoggerService, CommentsService],
})
export class ItemsModule {}
