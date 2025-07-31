import { PrivyAuthService } from './privy-auth.service';
import { UsersService } from '../Users/users.service';
export declare class PrivySyncController {
    private readonly privyAuthService;
    private readonly usersService;
    constructor(privyAuthService: PrivyAuthService, usersService: UsersService);
    createUserInPrivy(body: {
        privyId: string;
        username: string;
        email?: string;
    }): Promise<{
        success: boolean;
        message: string;
        user: import("../Users/interfaces/users.interface").User;
    }>;
    testConnection(): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
        privyConfigured: boolean;
    }>;
    healthCheck(): Promise<{
        success: boolean;
        timestamp: string;
        database: {
            connected: boolean;
            userCount: number;
        };
        privy: {
            apiKeyConfigured: boolean;
            appIdConfigured: boolean;
            appId: string;
        };
        environment: {
            nodeEnv: string;
            port: string | number;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        timestamp: string;
        database?: undefined;
        privy?: undefined;
        environment?: undefined;
    }>;
}
