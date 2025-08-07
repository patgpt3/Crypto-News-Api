import { Comment } from './../comments/schemas/comment.schema';
import { Item } from './interfaces/item.interface';
import { Model } from 'mongoose';
import { ItemDTO } from './dto/item.dto';
import { UsersService } from 'src/Users/users.service';
export declare class ItemsService {
    private readonly itemModel;
    private readonly commentModel;
    private usersService;
    constructor(itemModel: Model<Item>, commentModel: Model<Comment>, usersService: UsersService);
    private calculateHNScore;
    findAll(): Promise<Item[]>;
    findAllPast(): Promise<Item[]>;
    findAllNewest(): Promise<Item[]>;
    findAllMain(): Promise<Item[]>;
    findAllMainPagination(page: number): Promise<Item[]>;
    findAllMainPaginationByCategory(page: number, category: string): Promise<Item[]>;
    findAllNewestPagination(page: number): Promise<Item[]>;
    findAllNewestPaginationByCategory(page: number, category: string): Promise<Item[]>;
    findAllAskPagination(page: number): Promise<Item[]>;
    findAllAskPaginationByCategory(page: number, category: string): Promise<Item[]>;
    findAllShowPagination(page: number): Promise<Item[]>;
    findAllShowPaginationByCategory(page: number, category: string): Promise<Item[]>;
    findAllShow(): Promise<Item[]>;
    findAllAsk(): Promise<Item[]>;
    findById(id: string): Promise<Item>;
    findByNewest(id: string): Promise<Item>;
    findByPast(id: string): Promise<Item>;
    findByAlg(id: string): Promise<Item>;
    create(item: ItemDTO): Promise<import("mongoose").Document<unknown, {}, Item> & Item & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(id: string): Promise<Item>;
    update(id: string, item: ItemDTO): Promise<Item>;
    upVote(id: string, currentUser: {
        currentUserName: string;
    }): Promise<Item>;
    downVote(id: string, currentUser: {
        currentUserName: string;
    }): Promise<Item>;
}
