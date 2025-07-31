import { CommentDTO } from './dto/comment.dto';
import { CommentsService } from './comments.service';
import { Comment } from './interfaces/comment.interface';
import { LoggerService } from 'src/logger/logger.service';
export declare class CommentsController {
    private commentsService;
    private logger;
    constructor(commentsService: CommentsService, logger: LoggerService);
    findAll(): Promise<Comment[]>;
    findById(param: any): Promise<Comment>;
    findAllNewest(): Promise<Comment[]>;
    findAllNewestPagination(param: any, page: {
        pageNumber: number;
    }): Promise<Comment[]>;
    findAllNewestPaginationByCategory(param: any, page: {
        pageNumber: number;
        cat: string;
    }): Promise<Comment[]>;
    findbyIds(idsObj: {
        comments: string[];
    }): Promise<Comment[]>;
    create(commentDTO: CommentDTO): Promise<Comment>;
    update(param: any, commentDTO: CommentDTO): Promise<Comment>;
    upVote(param: any, currentUser: {
        currentUserName: string;
    }): Promise<Comment>;
    downVote(param: any, currentUser: {
        currentUserName: string;
    }): Promise<Comment>;
    delete(param: any): Promise<Comment>;
}
