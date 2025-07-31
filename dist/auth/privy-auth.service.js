"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivyAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
let PrivyAuthService = class PrivyAuthService {
    constructor(configService) {
        this.configService = configService;
        this.privyAppId = this.configService.get('privy.appId') || 'cm4g4hzw102g3hlf5jgx0rxf9';
        this.jwksClient = jwksClient({
            jwksUri: `https://auth.privy.io/api/v1/apps/${this.privyAppId}/jwks.json`,
            cache: true,
            cacheMaxEntries: 5,
            cacheMaxAge: 600000,
        });
        this.privyApiKey = this.configService.get('privy.apiKey');
    }
    async verifyPrivyToken(token) {
        try {
            const decoded = jwt.decode(token, { complete: true });
            if (!decoded || !decoded.header.kid) {
                throw new Error('Invalid token format');
            }
            const key = await this.jwksClient.getSigningKey(decoded.header.kid);
            const publicKey = key.getPublicKey();
            const verified = jwt.verify(token, publicKey, {
                algorithms: ['ES256'],
                issuer: 'https://auth.privy.io',
                audience: this.privyAppId,
            });
            return verified;
        }
        catch (error) {
            console.error('Error verifying Privy token:', error);
            throw error;
        }
    }
    async verifyPrivyUser(privyId, authToken) {
        try {
            console.log('🔍 Verifying Privy user:', privyId);
            if (authToken) {
                try {
                    const verified = await this.verifyPrivyToken(authToken);
                    console.log('✅ Privy token verified:', verified);
                    return true;
                }
                catch (error) {
                    console.error('❌ Privy token verification failed:', error);
                    return false;
                }
            }
            if (this.privyApiKey) {
                try {
                    const response = await fetch(`https://auth.privy.io/api/v1/apps/${this.privyAppId}/users/${privyId}`, {
                        headers: {
                            'Authorization': `Bearer ${this.privyApiKey}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        console.log('✅ User verified via Privy API:', userData);
                        return true;
                    }
                    else {
                        console.error('❌ User not found in Privy:', response.status);
                        return false;
                    }
                }
                catch (error) {
                    console.error('❌ Error calling Privy API:', error);
                    return false;
                }
            }
            if (!privyId || typeof privyId !== 'string' || privyId.trim().length === 0) {
                return false;
            }
            console.log('⚠️ Using fallback verification for privyId:', privyId);
            return true;
        }
        catch (error) {
            console.error('❌ Error verifying Privy user:', error);
            return false;
        }
    }
    async createUserFromPrivy(privyId, username, authToken) {
        try {
            console.log('👤 Creating user from Privy:', privyId, username);
            const isValid = await this.verifyPrivyUser(privyId, authToken);
            if (!isValid) {
                throw new Error('Invalid Privy user');
            }
            return {
                privyId,
                username,
                points: 0,
                isFlagged: 0,
                submissions: [],
                comments: [],
                upvotedSubmissions: [],
                jobs: [],
                replies: []
            };
        }
        catch (error) {
            console.error('❌ Error creating user from Privy:', error);
            throw error;
        }
    }
    async getUserFromPrivy(privyId) {
        if (!this.privyApiKey) {
            throw new Error('PRIVY_API_KEY not configured');
        }
        try {
            const response = await fetch(`https://auth.privy.io/api/v1/apps/${this.privyAppId}/users/${privyId}`, {
                headers: {
                    'Authorization': `Bearer ${this.privyApiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Privy API error: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('❌ Error fetching user from Privy:', error);
            throw error;
        }
    }
};
exports.PrivyAuthService = PrivyAuthService;
exports.PrivyAuthService = PrivyAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrivyAuthService);
//# sourceMappingURL=privy-auth.service.js.map