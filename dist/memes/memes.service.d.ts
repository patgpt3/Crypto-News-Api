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
export declare class MemesService {
    private readonly memeModel;
    constructor(memeModel: Model<MemeDoc>);
    list(category?: string, sort?: 'top' | 'new', limit?: number, page?: number): Promise<(import("mongoose").FlattenMaps<MemeDoc> & Required<{
        _id: string;
    }>)[]>;
    create(body: {
        title: string;
        imageUrl: string;
        sourceUrl?: string;
        category: string;
        createdBy?: string;
    }): Promise<MemeDoc & Required<{
        _id: string;
    }>>;
    upvote(id: string): Promise<{
        ok: boolean;
        points: any;
    }>;
}
