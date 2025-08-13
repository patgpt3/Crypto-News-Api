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

  async findAllNewestPaginationByCategory(page: number, category: string): Promise<Comment[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const commentsNewest = await this.commentModel
      .find({ category: category?.toLowerCase() })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return commentsNewest;
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
    // Ensure target item exists and normalize category to the item's category
    const targetItem = await this.itemsService.findById(comment.item);
    if (!targetItem) {
      throw new Error('Target article/item not found');
    }
    const newComment = await new this.commentModel(comment);
    // normalize category to avoid cross-page bleed
    (newComment as any).category = (targetItem as any)?.category
      ? String((targetItem as any).category).toLowerCase()
      : ((newComment as any).category || '').toLowerCase();

    // compute dedupe hash: simple normalized text+item+author
    try {
      const norm = (newComment.comment || '').trim().replace(/\s+/g, ' ').toLowerCase();
      const key = `${newComment.item}|${newComment.author}|${norm}`;
      // lightweight hash
      let h = 0;
      for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
      (newComment as any).commentHash = h.toString(16);
    } catch {}

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

    try {
      return await newComment.save();
    } catch (e: any) {
      if (e?.code === 11000) {
        // duplicate key -> return existing duplicate to avoid spam
        const existing = await this.commentModel.findOne({ item: newComment.item, author: newComment.author, commentHash: (newComment as any).commentHash }).lean();
        return existing as any;
      }
      throw e;
    }
  }

  async cleanupInconsistentComments(): Promise<{ total: number; deleted: number }> {
    const all = await this.commentModel.find({}, { _id: 1, item: 1, category: 1 } as any).lean() as any[];
    let deleted = 0;
    for (const c of all) {
      try {
        const item = await this.itemsService.findById(c.item as any);
        if (!item) {
          await this.commentModel.findByIdAndDelete(c._id as any);
          deleted++;
          continue;
        }
        const ic = (item as any)?.category ? String((item as any).category).toLowerCase() : undefined;
        const cc = (c as any)?.category ? String((c as any).category).toLowerCase() : undefined;
        if (ic && cc && ic !== cc) {
          await this.commentModel.findByIdAndDelete(c._id as any);
          deleted++;
        }
      } catch {}
    }
    return { total: all.length, deleted };
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
