import { Reply } from './interfaces/replies.interface';
import { Model } from 'mongoose';
import { ReplyDTO } from './dto/reply.dto';
import { UsersService } from 'src/Users/users.service';
import { CommentsService } from 'src/comments/comments.service';
export declare class RepliesService {
    private readonly replyModel;
    private usersService;
    private commentsService;
    constructor(replyModel: Model<Reply>, usersService: UsersService, commentsService: CommentsService);
    findAll(): Promise<Reply[]>;
    findById(id: string): Promise<Reply>;
    create(reply: ReplyDTO): Promise<import("mongoose").Document<unknown, {}, Reply> & Reply & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getReplyWithNestedReplies(replyId: string): Promise<any>;
    delete(id: string): Promise<Reply>;
    update(id: string, reply: ReplyDTO): Promise<Reply>;
    upVote(id: string, currentUser: {
        currentUserName: string;
    }): Promise<Reply>;
    downVote(id: string, currentUser: {
        currentUserName: string;
    }): Promise<Reply>;
}
