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
    try {
      console.log('Creating reply with data:', JSON.stringify(reply, null, 2));
      
      const newReply = await new this.replyModel(reply);

      // Save the reply first
      const savedReply = await newReply.save();
      console.log(`✅ Reply created successfully: ${savedReply._id}`);

      // Then handle the relationships
      if (newReply.parentReply) {
        // This is a nested reply within another reply
        console.log(`✅ Nested reply created with parent: ${newReply.parentReply}`);
        
        try {
          // Find the parent reply
          const parentReply = await this.replyModel.findById(newReply.parentReply);
          
          if (parentReply) {
            // Initialize replies array if it doesn't exist
            if (!parentReply.replies) {
              parentReply.replies = [];
            }

            // Add the new reply to parent's replies array
            parentReply.replies.push(savedReply._id);
            
            // Update the parent reply with new replies array
            await this.replyModel.findByIdAndUpdate(newReply.parentReply, {
              replies: parentReply.replies
            });
            
            console.log(`✅ Nested reply added to parent reply: ${parentReply._id}`);
          } else {
            console.error(`⚠️ Parent reply not found: ${newReply.parentReply}`);
          }
        } catch (parentError) {
          console.error('⚠️ Parent reply update failed:', parentError);
          console.error('Error details:', parentError.message);
        }
      } else {
        // This is a top-level reply to a comment
        if (reply.commentId) {
          try {
            const comment = await this.commentsService.findById(reply.commentId.toString());
            
            if (comment) {
              // Initialize replies array if it doesn't exist
              if (!comment.replies) {
                comment.replies = [];
              }

              // Add the new reply to comment's replies array
              comment.replies.push(savedReply._id.toString());
              
              // Update the comment with new replies array
              await this.commentsService.update(reply.commentId.toString(), {
                replies: comment.replies
              });
              
              console.log(`✅ Top-level reply added to comment: ${comment._id}`);
            }
          } catch (commentError) {
            console.error('⚠️ Comment update failed:', commentError);
          }
        }
      }

      // Add reply to user (temporarily disabled for debugging)
      console.log(`✅ Reply created for user: ${newReply.author}`);
      
      return savedReply;
      
    } catch (error) {
      console.error('❌ Error creating reply:', error);
      throw error;
    }
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
    try {
      // Fetch the initial reply and convert it to a plain object for manipulation
      const reply = await this.replyModel.findById(replyId).lean();
      
      if (!reply) {
        throw new Error('Reply not found');
      }

      // Recursive function to populate replies for each reply object
      async function populateReplies(reply, replyModel) {
        if (reply.replies && reply.replies.length > 0) {
          reply.replies = await Promise.all(
            reply.replies.map(async (nestedReplyId) => {
              const nestedReply = await replyModel.findById(nestedReplyId).lean();
              if (nestedReply) {
                return await populateReplies(nestedReply, replyModel); // Recursively populate nested replies
              }
              return null;
            }),
          );
          // Filter out null values
          reply.replies = reply.replies.filter(r => r !== null);
        }
        return reply;
      }

      // Call the recursive function with the reply and replyModel context
      const populatedReply = await populateReplies(reply, this.replyModel);
      console.log(`✅ Retrieved nested replies for reply: ${replyId}`);
      
      return populatedReply;
      
    } catch (error) {
      console.error('❌ Error getting nested replies:', error);
      throw error;
    }
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
