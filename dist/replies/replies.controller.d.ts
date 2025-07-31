import { ReplyDTO } from './dto/reply.dto';
import { RepliesService } from './replies.service';
import { Reply } from './interfaces/replies.interface';
import { LoggerService } from 'src/logger/logger.service';
export declare class RepliesController {
    private repliesService;
    private logger;
    constructor(repliesService: RepliesService, logger: LoggerService);
    findAll(): Promise<Reply[]>;
    findById(param: any): Promise<Reply>;
    getReplyWithNestedReplies(param: any): Promise<Reply>;
    findbyIds(idsObj: {
        replies: string[];
    }): Promise<Reply[]>;
    create(replyDTO: ReplyDTO): Promise<Reply>;
    update(param: any, replyDTO: ReplyDTO): Promise<Reply>;
    delete(param: any): Promise<Reply>;
    upVote(param: any, currentUser: {
        currentUserName: string;
    }): Promise<Reply>;
    downVote(param: any, currentUser: {
        currentUserName: string;
    }): Promise<Reply>;
}
