import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface MemeDoc {
  _id: string;
  title: string;
  imageUrl: string;
  sourceUrl?: string;
  category: string;
  points: number;
  createdBy?: string;
  createdAt: Date;
}

@Injectable()
export class MemesService {
  constructor(@InjectModel('Meme') private readonly memeModel: Model<MemeDoc>) {}

  async list(category?: string, sort: 'top'|'new' = 'top', limit = 30, page = 0) {
    const where: any = {};
    if (category) where.category = category.toLowerCase();
    const order: any = sort === 'new' ? { createdAt: -1 } : { points: -1, createdAt: -1 };
    return this.memeModel.find(where).sort(order as any).skip(page*limit).limit(limit).lean();
  }

  async create(body: { title: string; imageUrl: string; sourceUrl?: string; category: string; createdBy?: string; }) {
    const created = await this.memeModel.create({
      title: body.title.trim(),
      imageUrl: body.imageUrl,
      sourceUrl: body.sourceUrl,
      category: body.category.toLowerCase(),
      createdBy: body.createdBy,
      createdAt: new Date(),
      points: 0,
    });
    return created.toObject();
  }

  async upvote(id: string) {
    const updated = await this.memeModel.findByIdAndUpdate(id, { $inc: { points: 1 } }, { new: true });
    if (!updated) throw new NotFoundException('Meme not found');
    return { ok: true, points: (updated as any).points };
  }
}


