import { Inject, Injectable } from '@nestjs/common';
import { Comment } from './interfaces/comment.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDTO } from './dto/comment.dto';
import { UsersService } from 'src/Users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(ItemsService) private itemsService: ItemsService,
  ) {}
  //   private readonly items: Item[] = [];

  async findAll(): Promise<Comment[]> {
    const findAllI = await this.commentModel.find().exec();
    return findAllI;
  }
  async findAllNewest(): Promise<Comment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const findAllI = await this.commentModel.find().exec();

    const itemsNewest = findAllI.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    return itemsNewest;
  }

  async findAllNewestPagination(page: number): Promise<Comment[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const itemsMain = await this.commentModel
      .find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return itemsMain;
  }

  async findById(id: string): Promise<Comment> {
    return id.match(/^[0-9a-fA-F]{24}$/)
      ? await this.commentModel.findOne({ _id: id })
      : null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return await this.commentModel.findOne({ _id: id });
    }
  }

  async create(comment: CommentDTO) {
    const newComment = await new this.commentModel(comment);

    //add to user
    const user = await this.usersService.findByUsername(newComment.author);
    const newUserComment = user.comments;
    newUserComment?.push(newComment.id);
    this.usersService.update(user.id, {
      comments: newUserComment || [newComment.id],
    });

    //add to item
    const item = await this.itemsService.findById(newComment.item);
    const newItemComments = item.comments;
    newItemComments?.push(newComment.id);
    this.itemsService.update(item.id, {
      comments: newItemComments || [newComment.id],
    });

    return newComment.save();
  }
  async delete(id: string): Promise<Comment> {
    return this.commentModel.findByIdAndDelete(id);
  }

  async update(id: string, comment: CommentDTO): Promise<Comment> {
    return await this.commentModel.findByIdAndUpdate(id, comment, {
      new: true,
    });
  }
  async upVote(
    id: string,
    currentUser: { currentUserName: string },
  ): Promise<Comment> {
    const item = await this.findById(id);

    const user = await this.usersService.findByUsername(
      currentUser.currentUserName,
    );
    const newUpvotes = user?.upvotedSubmissions;
    newUpvotes?.push(id);
    this.usersService.update(user.id, {
      upvotedSubmissions: newUpvotes || [id],
    });

    return await this.commentModel.findByIdAndUpdate(
      id,
      { points: item.points + 1 },
      { new: true },
    );
  }
  async downVote(
    id: string,
    currentUser: { currentUserName: string },
  ): Promise<Comment> {
    const item = await this.findById(id);

    const user = await this.usersService.findByUsername(
      currentUser.currentUserName,
    );
    const newUpVotedSubmissions = user.upvotedSubmissions.filter(
      (vote) => vote !== id,
    );
    this.usersService.update(user.id, {
      upvotedSubmissions: newUpVotedSubmissions,
    });

    return await this.commentModel.findByIdAndUpdate(
      id,
      { points: item.points - 1 },
      { new: true },
    );
  }
}
