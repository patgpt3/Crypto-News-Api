export interface User {
    id: string;
    username: string;
    password?: string;
    about?: string;
    email?: string;
    createdAt?: Date;
    isFlagged?: number;
    points?: number;
    submissions?: string[];
    comments?: string[];
    upvotedSubmissions?: string[];
    jobs?: string[];
    replies?: string[];
}
