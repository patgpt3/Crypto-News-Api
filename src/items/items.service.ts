import { Comment } from './../comments/schemas/comment.schema';
import { Inject, Injectable } from '@nestjs/common';
import { Item } from './interfaces/item.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ItemDTO } from './dto/item.dto';
import { UsersService } from 'src/Users/users.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel('Item') private readonly itemModel: Model<Item>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  /**
   * Calculate Hacker News ranking score
   * Formula: (points - 1) / (time + 2)^1.5
   * @param points Number of upvotes
   * @param createdAt Post creation time
   * @returns HN ranking score
   */
  private calculateHNScore(points: number, createdAt: Date): number {
    const now = Date.now();
    const timeInHours = (now - createdAt.getTime()) / 1000 / 3600;
    return (points - 1) / Math.pow(timeInHours + 2, 1.5);
  }
  //   private readonly items: Item[] = [];

  async findAll(): Promise<Item[]> {
    const findAllI = await this.itemModel.find().exec();
    return findAllI;
  }
  async findAllPast(): Promise<Item[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const findAllI = await this.itemModel.find().exec();

    const itemsBeforeToday = findAllI.filter((item) => item.createdAt < today);
    return itemsBeforeToday;
  }
  async findAllNewest(): Promise<Item[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const findAllI = await this.itemModel.find().exec();

    const itemsNewest = findAllI.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    return itemsNewest;
  }

  async findAllMain(): Promise<Item[]> {
    const findAllI = await this.itemModel.find().exec();

    const itemsMain = findAllI.sort((a, b) => {
      const scoreA = this.calculateHNScore(a.points, a.createdAt);
      const scoreB = this.calculateHNScore(b.points, b.createdAt);
      return scoreB - scoreA;
    });
    return itemsMain;
  }

  async findAllMainPagination(page: number): Promise<Item[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const itemsMain = await this.itemModel.aggregate([
      {
        $addFields: {
          // Hacker News ranking algorithm: (points - 1) / (time + 2)^1.5
          timeInHours: {
            $divide: [
              { $subtract: [new Date(), '$createdAt'] },
              1000 * 3600 // Convert to hours
            ]
          }
        },
      },
      {
        $addFields: {
          customScore: {
            $divide: [
              { $subtract: ['$points', 1] },
              {
                $pow: [
                  { $add: ['$timeInHours', 2] },
                  1.5
                ]
              }
            ]
          }
        }
      },
      { $sort: { customScore: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ]);

    return itemsMain;
  }

  async findAllMainPaginationByCategory(page: number, category: string): Promise<Item[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const itemsMain = await this.itemModel.aggregate([
      { $match: { category: category } },
      {
        $addFields: {
          // Hacker News ranking algorithm: (points - 1) / (time + 2)^1.5
          timeInHours: {
            $divide: [
              { $subtract: [new Date(), '$createdAt'] },
              1000 * 3600 // Convert to hours
            ]
          }
        },
      },
      {
        $addFields: {
          customScore: {
            $divide: [
              { $subtract: ['$points', 1] },
              {
                $pow: [
                  { $add: ['$timeInHours', 2] },
                  1.5
                ]
              }
            ]
          }
        }
      },
      { $sort: { customScore: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ]);

    return itemsMain;
  }

  async findAllNewestPagination(page: number): Promise<Item[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const itemsMain = await this.itemModel
      .find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return itemsMain;
  }

  async findAllNewestPaginationByCategory(page: number, category: string): Promise<Item[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const itemsNewest = await this.itemModel
      .find({ category: category })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return itemsNewest;
  }

  async findAllAskPagination(page: number): Promise<Item[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const itemsMain = await this.itemModel
      .find({ title: { $regex: '^AskAIN', $options: 'i' } })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return itemsMain;
  }

  async findAllAskPaginationByCategory(page: number, category: string): Promise<Item[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const itemsAsk = await this.itemModel
      .find({ category: category, title: { $regex: '^Ask', $options: 'i' } })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return itemsAsk;
  }

  async findAllShowPagination(page: number): Promise<Item[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const itemsMain = await this.itemModel
      .find({ title: { $regex: '^ShowAIN', $options: 'i' } })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return itemsMain;
  }

  async findAllShowPaginationByCategory(page: number, category: string): Promise<Item[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const itemsShow = await this.itemModel
      .find({ category: category, title: { $regex: '^Show', $options: 'i' } })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return itemsShow;
  }

  async findAllShow(): Promise<Item[]> {
    const findAllI = await this.itemModel.find().exec();

    const itemsShow = findAllI.filter((item) =>
      item.title.startsWith('ShowCN:'),
    );
    return itemsShow;
  }

  async findAllAsk(): Promise<Item[]> {
    const findAllI = await this.itemModel.find().exec();

    const itemsAsk = findAllI.filter((item) => item.title.startsWith('AskCN:'));
    return itemsAsk;
  }

  async findById(id: string): Promise<Item> {
    return id.match(/^[0-9a-fA-F]{24}$/)
      ? await this.itemModel.findOne({ _id: id })
      : null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return await this.itemModel.findOne({ _id: id });
    }
  }

  async findByNewest(id: string): Promise<Item> {
    return id.match(/^[0-9a-fA-F]{24}$/)
      ? await this.itemModel.findOne({ _id: id })
      : null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return await this.itemModel.findOne({ _id: id });
    }
  }

  async findByPast(id: string): Promise<Item> {
    return id.match(/^[0-9a-fA-F]{24}$/)
      ? await this.itemModel.findOne({ _id: id })
      : null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return await this.itemModel.findOne({ _id: id });
    }
  }

  async findByAlg(id: string): Promise<Item> {
    return id.match(/^[0-9a-fA-F]{24}$/)
      ? await this.itemModel.findOne({ _id: id })
      : null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return await this.itemModel.findOne({ _id: id });
    }
  }

  async create(item: ItemDTO) {
    const newItem = await new this.itemModel(item);
    
    // Try to find user by username and update their submissions
    try {
      const user = await this.usersService.findByUsername(newItem.author);
      if (user) {
        const newSubmissions = user.submissions || [];
        newSubmissions.push(newItem.id);
        await this.usersService.update(user.id, {
          submissions: newSubmissions,
        });
      }
    } catch (error) {
      console.log('Warning: Could not update user submissions:', error.message);
      // Continue with item creation even if user update fails
    }
    
    return newItem.save();
  }
  async delete(id: string): Promise<Item> {
    // Step 1: Find the item by ID to retrieve the comment IDs
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const item = await this.itemModel.findById(id);

    // Step 2: Delete all comments associated with this item
    await this.commentModel.deleteMany({ _id: { $in: item.comments } });

    // Step 3: Delete the item itself
    return this.itemModel.findByIdAndDelete(id);
  }

  async update(id: string, item: ItemDTO): Promise<Item> {
    return await this.itemModel.findByIdAndUpdate(id, item, { new: true });
  }

  // Recompute each item's comments array to unique existing comment IDs
  async reconcileCommentCounts(): Promise<{ scanned: number; updated: number }> {
    const items = await this.itemModel.find({}, { _id: 1, comments: 1 }).lean();
    let updated = 0;
    for (const it of items as any[]) {
      const ids = Array.isArray(it.comments) ? [...new Set(it.comments.filter(Boolean))] : [];
      if (ids.length === 0) continue;
      const existing = await this.commentModel.find({ _id: { $in: ids } }, { _id: 1 }).lean();
      const validIds = existing.map((c: any) => String(c._id));
      if (JSON.stringify(validIds) !== JSON.stringify(ids)) {
        await this.itemModel.updateOne({ _id: it._id }, { $set: { comments: validIds } });
        updated++;
      }
    }
    return { scanned: items.length, updated };
  }

  async upVote(
    id: string,
    currentUser: { currentUserName: string },
  ): Promise<Item> {
    const item = await this.findById(id);
    const user = await this.usersService.findByUsername(
      currentUser.currentUserName,
    );
    const newUpvotes = user?.upvotedSubmissions;
    newUpvotes?.push(id);
    this.usersService.update(user.id, {
      upvotedSubmissions: newUpvotes || [id],
    });

    return await this.itemModel.findByIdAndUpdate(
      id,
      { points: item.points + 1 },
      { new: true },
    );
  }
  async downVote(
    id: string,
    currentUser: { currentUserName: string },
  ): Promise<Item> {
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

    return await this.itemModel.findByIdAndUpdate(
      id,
      { points: item.points - 1 },
      { new: true },
    );
  }
}
