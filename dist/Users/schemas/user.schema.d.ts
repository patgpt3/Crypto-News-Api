import { Document } from 'mongoose';
export declare class User extends Document {
    username: string;
    password: string;
    privyId: string;
    about: string;
    email: string;
    isFlagged: number;
    points: number;
    submissions: string[];
    comments: string[];
    upvotedSubmissions: string[];
    jobs: string[];
    replies: string[];
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
}>;
