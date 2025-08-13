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

  async dedupeExactDuplicates(): Promise<{ scanned: number; duplicates: number; deleted: number; reconciled: { scanned: number; updated: number } }> {
    const fields: any = { _id: 1, item: 1, author: 1, comment: 1, createdAt: 1 };
    const all = await this.commentModel.find({}, fields).lean() as any[];
    const keepByKey = new Map<string, any>();
    const dupIds: string[] = [];
    for (const c of all) {
      const normText = String(c.comment || '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
      const key = `${c.item}|${c.author}|${normText}`;
      const existing = keepByKey.get(key);
      if (!existing) {
        keepByKey.set(key, c);
      } else {
        // keep earliest createdAt, delete the other
        const older = (new Date(existing.createdAt).getTime() <= new Date(c.createdAt).getTime()) ? existing : c;
        const newer = older === existing ? c : existing;
        keepByKey.set(key, older);
        dupIds.push(String(newer._id));
      }
    }
    let deleted = 0;
    if (dupIds.length > 0) {
      await this.commentModel.deleteMany({ _id: { $in: dupIds } } as any);
      deleted = dupIds.length;
    }
    const reconciled = await this.itemsService.reconcileCommentCounts();
    return { scanned: all.length, duplicates: dupIds.length, deleted, reconciled } as any;
  }

  private normalizeText(input: string): string {
    return String(input || '')
      .toLowerCase()
      .replace(/https?:\/\/\S+/g, '') // strip urls
      .replace(/[^a-z0-9\s]/g, '') // keep alphanum/space
      .replace(/\s+/g, ' ') // collapse ws
      .trim();
  }

  private jaccardSimilarity(a: string, b: string): number {
    const sa = new Set(a.split(' ').filter(Boolean));
    const sb = new Set(b.split(' ').filter(Boolean));
    if (sa.size === 0 && sb.size === 0) return 1;
    let intersect = 0;
    for (const t of sa) if (sb.has(t)) intersect++;
    const union = sa.size + sb.size - intersect;
    return union === 0 ? 0 : intersect / union;
  }

  async dedupeNearDuplicates(windowMinutes = 120, similarity = 0.9): Promise<{ groups: number; deleted: number; scanned: number; reconciled: { scanned: number; updated: number } }> {
    const fields: any = { _id: 1, item: 1, author: 1, comment: 1, createdAt: 1 };
    const all = await this.commentModel.find({}, fields).lean() as any[];
    // group by item+author
    const groups = new Map<string, any[]>();
    for (const c of all) {
      const key = `${c.item}|${c.author}`;
      const arr = groups.get(key) || [];
      arr.push(c);
      groups.set(key, arr);
    }
    let deleted = 0;
    for (const [, arr] of groups) {
      arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const keep: any[] = [];
      for (const c of arr) {
        const norm = this.normalizeText(c.comment);
        let isDup = false;
        for (const k of keep) {
          const dt = Math.abs(new Date(c.createdAt).getTime() - new Date(k.createdAt).getTime());
          if (dt > windowMinutes * 60 * 1000) continue;
          const sim = this.jaccardSimilarity(norm, this.normalizeText(k.comment));
          if (sim >= similarity) { isDup = true; break; }
        }
        if (!isDup) keep.push(c);
        else {
          await this.commentModel.deleteOne({ _id: c._id } as any);
          deleted++;
        }
      }
    }
    const reconciled = await this.itemsService.reconcileCommentCounts();
    return { groups: groups.size, deleted, scanned: all.length, reconciled } as any;
  }

  async purgeItems(itemIds: string[], mode: 'all' | 'auto' = 'auto'): Promise<{ items: number; removed: number; reconciled: { scanned: number; updated: number } }> {
    let removed = 0;
    const ids = Array.from(new Set(itemIds.filter(Boolean)));
    if (ids.length === 0) return { items: 0, removed: 0, reconciled: { scanned: 0, updated: 0 } } as any;
    if (mode === 'all') {
      const res = await this.commentModel.deleteMany({ item: { $in: ids } } as any);
      removed = (res as any)?.deletedCount || 0;
    } else {
      for (const itemId of ids) {
        const rows = await this.commentModel.find({ item: itemId } as any, { _id: 1, author: 1, comment: 1, createdAt: 1 } as any).lean() as any[];
        // per author on this item
        const byAuthor = new Map<string, any[]>();
        for (const r of rows) {
          const a = byAuthor.get(r.author) || [];
          a.push(r);
          byAuthor.set(r.author, a);
        }
        for (const [, arr] of byAuthor) {
          arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          const keep: any[] = [];
          for (const c of arr) {
            const norm = this.normalizeText(c.comment);
            let isDup = false;
            for (const k of keep) {
              const dt = Math.abs(new Date(c.createdAt).getTime() - new Date(k.createdAt).getTime());
              if (dt > 120 * 60 * 1000) continue;
              const sim = this.jaccardSimilarity(norm, this.normalizeText(k.comment));
              if (sim >= 0.9) { isDup = true; break; }
            }
            if (!isDup) keep.push(c);
            else {
              await this.commentModel.deleteOne({ _id: c._id } as any);
              removed++;
            }
          }
        }
      }
    }
    const reconciled = await this.itemsService.reconcileCommentCounts();
    return { items: ids.length, removed, reconciled } as any;
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
