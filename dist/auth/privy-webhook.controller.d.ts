import { PrivyAuthService } from './privy-auth.service';
import { UsersService } from '../Users/users.service';
export declare class PrivyWebhookController {
    private readonly privyAuthService;
    private readonly usersService;
    constructor(privyAuthService: PrivyAuthService, usersService: UsersService);
    handleUserCreated(body: any, signature: string): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        user: import("mongoose").Document<unknown, {}, import("../Users/interfaces/users.interface").User> & import("../Users/interfaces/users.interface").User & {
            _id: import("mongoose").Types.ObjectId;
        };
        message?: undefined;
    }>;
    handleUserUpdated(body: any, signature: string): Promise<{
        success: boolean;
    }>;
}
