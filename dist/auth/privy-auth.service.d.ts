import { ConfigService } from '@nestjs/config';
export declare class PrivyAuthService {
    private configService;
    private jwksClient;
    private privyApiKey;
    private privyAppId;
    constructor(configService: ConfigService);
    verifyPrivyToken(token: string): Promise<any>;
    verifyPrivyUser(privyId: string, authToken?: string): Promise<boolean>;
    createUserFromPrivy(privyId: string, username: string, authToken?: string): Promise<any>;
    getUserFromPrivy(privyId: string): Promise<any>;
}
