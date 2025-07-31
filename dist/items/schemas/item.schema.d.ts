import { Document } from 'mongoose';
export declare class Item extends Document {
    title: string;
    url: string;
    text: string;
    points: number;
    author: string;
    comments: string[];
    isFlagged: number;
    category: string;
}
export declare const ItemSchema: import("mongoose").Schema<Item, import("mongoose").Model<Item, any, any, any, Document<unknown, any, Item> & Item & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Item, Document<unknown, {}, import("mongoose").FlatRecord<Item>> & import("mongoose").FlatRecord<Item> & {
    _id: import("mongoose").Types.ObjectId;
}>;
