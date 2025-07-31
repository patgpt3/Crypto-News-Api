import { AuthService } from './auth.service';
import { UsersService } from 'src/Users/users.service';
import { UserDTO } from 'src/Users/dto/users.dto';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(req: any): Promise<{
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
    registerUser(createUserDto: UserDTO): Promise<import("mongoose").Document<unknown, {}, import("../Users/interfaces/users.interface").User> & import("../Users/interfaces/users.interface").User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
