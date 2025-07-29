import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentSchema } from './schemas/comment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from 'src/logger/logger.service';
import { ItemsService } from 'src/items/items.service';
import { UsersModule } from 'src/Users/users.module';
import { ItemSchema } from 'src/items/schemas/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    UsersModule, // Import UsersModule instead of directly providing UsersService
  ],
  controllers: [CommentsController],
  providers: [CommentsService, LoggerService, ItemsService],
})
export class CommentsModule {}
