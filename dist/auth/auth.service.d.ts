import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/Users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/Users/interfaces/users.interface';
export declare class AuthService {
    private usersService;
    private logger;
    private jwtService;
    constructor(usersService: UsersService, logger: LoggerService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<{
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
    login(user: User): Promise<{
        accesstoken: string;
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
