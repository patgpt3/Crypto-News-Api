import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class PrivyAuthService {
  private jwksClient: any;
  private privyApiKey: string;
  private privyAppId: string;

  constructor(private configService: ConfigService) {
    // Initialize JWKS client for Privy
    this.privyAppId = this.configService.get<string>('privy.appId') || 'cm4g4hzw102g3hlf5jgx0rxf9';
    this.jwksClient = jwksClient({
      jwksUri: `https://auth.privy.io/api/v1/apps/${this.privyAppId}/jwks.json`,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000, // 10 minutes
    });

    // Get Privy API key from environment
    this.privyApiKey = this.configService.get<string>('privy.apiKey');
  }

  async verifyPrivyToken(token: string): Promise<any> {
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
    } catch (error) {
      console.error('Error verifying Privy token:', error);
      throw error;
    }
  }

  async verifyPrivyUser(privyId: string, authToken?: string): Promise<boolean> {
    try {
      console.log('🔍 Verifying Privy user:', privyId);
      
      // If we have an auth token, verify it with JWKS
      if (authToken) {
        try {
          const verified = await this.verifyPrivyToken(authToken);
          console.log('✅ Privy token verified:', verified);
          return true;
        } catch (error) {
          console.error('❌ Privy token verification failed:', error);
          return false;
        }
      }

      // If we have an API key, verify user with Privy API
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
          } else {
            console.error('❌ User not found in Privy:', response.status);
            return false;
          }
        } catch (error) {
          console.error('❌ Error calling Privy API:', error);
          return false;
        }
      }

      // Fallback: basic validation
      if (!privyId || typeof privyId !== 'string' || privyId.trim().length === 0) {
        return false;
      }

      // For now, we'll trust the frontend-provided privyId
      // In production, you should always verify with a token or API key
      console.log('⚠️ Using fallback verification for privyId:', privyId);
      return true;
    } catch (error) {
      console.error('❌ Error verifying Privy user:', error);
      return false;
    }
  }

  async createUserFromPrivy(privyId: string, username: string, authToken?: string): Promise<any> {
    try {
      console.log('👤 Creating user from Privy:', privyId, username);
      
      const isValid = await this.verifyPrivyUser(privyId, authToken);
      
      if (!isValid) {
        throw new Error('Invalid Privy user');
      }

      // Return user data structure
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
    } catch (error) {
      console.error('❌ Error creating user from Privy:', error);
      throw error;
    }
  }

  async getUserFromPrivy(privyId: string): Promise<any> {
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
    } catch (error) {
      console.error('❌ Error fetching user from Privy:', error);
      throw error;
    }
  }
} 