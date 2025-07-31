import { User } from './interfaces/users.interface';
import { Model } from 'mongoose';
import { UserDTO } from './dto/users.dto';
import { PrivyAuthService } from '../auth/privy-auth.service';
export declare class UsersService {
    private readonly userModel;
    private readonly privyAuthService;
    constructor(userModel: Model<User>, privyAuthService: PrivyAuthService);
    findAll(): Promise<User[]>;
    findAllProtected(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByUsername(Username: string): Promise<User>;
    findByUsernameProtected(Username: string): Promise<User>;
    findByPrivyId(privyId: string): Promise<User>;
    create(user: UserDTO): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(id: string): Promise<User>;
    update(id: string, user: UserDTO): Promise<User>;
}
