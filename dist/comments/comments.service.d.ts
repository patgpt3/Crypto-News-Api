import { Comment } from './interfaces/comment.interface';
import { Model } from 'mongoose';
import { CommentDTO } from './dto/comment.dto';
import { UsersService } from 'src/Users/users.service';
import { ItemsService } from 'src/items/items.service';
export declare class CommentsService {
    private readonly commentModel;
    private usersService;
    private itemsService;
    constructor(commentModel: Model<Comment>, usersService: UsersService, itemsService: ItemsService);
    findAll(): Promise<Comment[]>;
    findAllNewest(): Promise<Comment[]>;
    findAllNewestPagination(page: number): Promise<Comment[]>;
    findAllNewestPaginationByCategory(page: number, category: string): Promise<Comment[]>;
    findById(id: string): Promise<Comment>;
    create(comment: CommentDTO): Promise<import("mongoose").Document<unknown, {}, Comment> & Comment & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(id: string): Promise<Comment>;
    update(id: string, comment: CommentDTO): Promise<Comment>;
    upVote(id: string, currentUser: {
        currentUserName: string;
    }): Promise<Comment>;
    downVote(id: string, currentUser: {
        currentUserName: string;
    }): Promise<Comment>;
}
