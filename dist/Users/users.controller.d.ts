import { UserDTO } from './dto/users.dto';
import { User } from './interfaces/users.interface';
import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    private logger;
    constructor(usersService: UsersService, logger: LoggerService);
    findAll(): Promise<User[]>;
    findAllProtected(): Promise<User[]>;
    findById(param: any): Promise<User>;
    findByUsername(param: any): Promise<User>;
    findByUsernameProtected(param: any): Promise<User>;
    findByPrivyId(param: any): Promise<User>;
    create(userDTO: UserDTO): Promise<User>;
    update(param: any, userDTO: UserDTO): Promise<User>;
    delete(param: any): Promise<User>;
}
