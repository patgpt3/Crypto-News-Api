import { PrivyAuthService } from './privy-auth.service';
import { UsersService } from '../Users/users.service';
export declare class PrivyVerifyController {
    private readonly privyAuthService;
    private readonly usersService;
    constructor(privyAuthService: PrivyAuthService, usersService: UsersService);
    verifyAndCreateUser(body: {
        privyId: string;
        username: string;
        authToken?: string;
    }): Promise<{
        success: boolean;
        message: string;
        user: import("../Users/interfaces/users.interface").User;
    }>;
    getUserByPrivyId(privyId: string): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        user: import("../Users/interfaces/users.interface").User;
        message?: undefined;
    }>;
    syncUsers(body: {
        privyIds: string[];
    }): Promise<{
        success: boolean;
        results: any[];
    }>;
}
