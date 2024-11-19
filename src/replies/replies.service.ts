import { Inject, Injectable } from '@nestjs/common';
import { Reply } from './interfaces/replies.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReplyDTO } from './dto/reply.dto';
import { UsersService } from 'src/Users/users.service';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class RepliesService {
  constructor(
    @InjectModel('Reply') private readonly replyModel: Model<Reply>,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(CommentsService) private commentsService: CommentsService,
  ) {}
  //   private readonly items: Item[] = [];

  async findAll(): Promise<Reply[]> {
    const findAllI = await this.replyModel.find().exec();
    return findAllI;
  }

  async findById(id: string): Promise<Reply> {
    return id.match(/^[0-9a-fA-F]{24}$/)
      ? await this.replyModel.findOne({ _id: id })
      : null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return await this.replyModel.findOne({ _id: id });
    }
  }

  async create(reply: ReplyDTO) {
    const newReply = await new this.replyModel(reply);

    if (newReply.parentReply) {
      // This is a nested reply within another reply
      const parentReply = await this.replyModel.findById(newReply.parentReply);

      const newParentReply = parentReply.replies;
      newParentReply?.push(newReply.id);
      this.update(newReply.parentReply.toString(), {
        replies: newParentReply || [newReply.id],
      });

      // parentReply.replies.push(newReply._id);

      await parentReply.save();
    } else {
      // This is a top-level reply to a comment
      //add to commnent
      const comment = await this.commentsService.findById(
        reply.commentId.toString(),
      );
      const newCommentReply = comment?.replies;
      newCommentReply?.push(newReply.id);
      this.commentsService.update(newReply.commentId.toString(), {
        replies: newCommentReply || [newReply.id],
      });
    }

    // Add reply to user (optional, if needed)
    const user = await this.usersService.findByUsername(newReply.author);
    // user.replies.push(newReply._id.toString());
    // await this.usersService.update(user.id, { replies: user.replies });

    //add to user
    const newUserReply = user?.replies;
    newUserReply?.push(newReply.id);
    this.usersService.update(user.id, {
      replies: newUserReply || [newReply.id],
    });

    return newReply.save();
  }

  // async getReplyWithNestedReplies(replyId: string) {
  //   return this.replyModel
  //     .findById(replyId)
  //     .populate({
  //       path: 'replies',
  //       populate: {
  //         path: 'replies',
  //         populate: {
  //           path: 'replies',
  //           populate: {
  //             path: 'replies',
  //             populate: {
  //               path: 'replies',
  //               populate: { path: 'replies' }, // Continue nesting if necessary
  //             }, // Continue nesting if necessary
  //           }, // Continue nesting if necessary
  //         }, // Continue nesting if necessary
  //       },
  //     })
  //     .exec();
  // }
  async getReplyWithNestedReplies(replyId: string) {
    // Fetch the initial reply and convert it to a plain object for manipulation
    const reply = await this.replyModel.findById(replyId).lean();

    // Recursive function to populate replies for each reply object
    async function populateReplies(reply, replyModel) {
      if (reply.replies && reply.replies.length > 0) {
        reply.replies = await Promise.all(
          reply.replies.map(async (nestedReplyId) => {
            const nestedReply = await replyModel.findById(nestedReplyId).lean();
            return populateReplies(nestedReply, replyModel); // Recursively populate nested replies
          }),
        );
      }
      return reply;
    }

    // Call the recursive function with the reply and replyModel context
    return populateReplies(reply, this.replyModel);
  }
  // async getReplyWithNestedReplies(replyId: string) {
  //   // Find the top-level reply by ID
  //   const reply = await this.replyModel.findById(replyId).exec();
  //   if (!reply) return null;

  //   // Use a helper function to recursively populate nested replies
  //   return this.populateNestedReplies(reply);
  // }

  // private async populateNestedReplies(reply) {
  //   // Populate the first level of replies
  //   const populatedReply = await this.replyModel
  //     .findById(reply._id)
  //     .populate('replies')
  //     .exec();

  //   // Convert populatedReply.replies to an array if it's not already
  //   const repliesArray = Array.isArray(populatedReply.replies)
  //     ? populatedReply.replies
  //     : populatedReply.replies
  //       ? [populatedReply.replies]
  //       : [];

  //   // Recursively populate each nested reply
  //   populatedReply.replies = await Promise.all(
  //     repliesArray.map(async (nestedReply) => {
  //       return await this.populateNestedReplies(nestedReply);
  //     }),
  //   );

  //   return populatedReply;
  // }
  // async getReplyWithNestedReplies(replyId: string) {
  //   // Fetch the top-level reply by ID
  //   const reply = await this.replyModel.findById(replyId).exec();
  //   if (!reply) return null;

  //   // Populate nested replies recursively
  //   return this.populateNestedReplies(reply);
  // }

  // private async populateNestedReplies(reply) {
  //   // Populate the first level of replies
  //   const populatedReply = await this.replyModel
  //     .findById(reply._id)
  //     .populate('replies')
  //     .exec();

  //   // Ensure `replies` is treated as an array
  //   const repliesArray = Array.isArray(populatedReply.replies)
  //     ? populatedReply.replies
  //     : populatedReply.replies
  //       ? [populatedReply.replies]
  //       : [];

  //   // Recursively populate each nested reply
  //   populatedReply.replies = await Promise.all(
  //     repliesArray.map(async (nestedReply) => {
  //       return await this.populateNestedReplies(nestedReply);
  //     }),
  //   );

  //   return populatedReply;
  // }
  async delete(id: string): Promise<Reply> {
    return this.replyModel.findByIdAndDelete(id);
  }

  async update(id: string, reply: ReplyDTO): Promise<Reply> {
    return await this.replyModel.findByIdAndUpdate(id, reply, {
      new: true,
    });
  }
  async upVote(
    id: string,
    currentUser: { currentUserName: string },
  ): Promise<Reply> {
    const item = await this.findById(id);

    const user = await this.usersService.findByUsername(
      currentUser.currentUserName,
    );
    const newUpvotes = user?.upvotedSubmissions;
    newUpvotes?.push(id);
    this.usersService.update(user.id, {
      upvotedSubmissions: newUpvotes || [id],
    });

    return await this.replyModel.findByIdAndUpdate(
      id,
      { points: item.points + 1 },
      { new: true },
    );
  }
  async downVote(
    id: string,
    currentUser: { currentUserName: string },
  ): Promise<Reply> {
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

    return await this.replyModel.findByIdAndUpdate(
      id,
      { points: item.points - 1 },
      { new: true },
    );
  }
}
