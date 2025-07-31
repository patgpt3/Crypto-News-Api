import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(username: string, password: string): Promise<{
        id: string;
        username: string;
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
    }>;
}
export {};
