import { Document } from 'mongoose';
export declare class Job extends Document {
    title: string;
    url: string;
    text: string;
    isFlagged: number;
    author: string;
    category: string;
}
export declare const JobSchema: import("mongoose").Schema<Job, import("mongoose").Model<Job, any, any, any, Document<unknown, any, Job> & Job & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Job, Document<unknown, {}, import("mongoose").FlatRecord<Job>> & import("mongoose").FlatRecord<Job> & {
    _id: import("mongoose").Types.ObjectId;
}>;
