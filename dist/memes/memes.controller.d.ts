import { MemesService } from './memes.service';
export declare class MemesController {
    private readonly memes;
    constructor(memes: MemesService);
    list(category?: string, sort?: 'top' | 'new', limit?: string, page?: string): Promise<(import("mongoose").FlattenMaps<import("./memes.service").MemeDoc> & Required<{
        _id: string;
    }>)[]>;
    create(body: {
        title: string;
        imageUrl: string;
        sourceUrl?: string;
        category: string;
        createdBy?: string;
    }): Promise<import("./memes.service").MemeDoc & Required<{
        _id: string;
    }>>;
    upvote(id: string): Promise<{
        ok: boolean;
        points: any;
    }>;
}
