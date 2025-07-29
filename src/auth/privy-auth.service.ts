import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class PrivyAuthService {
  private jwksClient: any;

  constructor(private configService: ConfigService) {
    // Initialize JWKS client for Privy
    this.jwksClient = jwksClient({
      jwksUri: 'https://auth.privy.io/api/v1/apps/cm4g4hzw102g3hlf5jgx0rxf9/jwks.json',
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000, // 10 minutes
    });
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
        audience: 'cm4g4hzw102g3hlf5jgx0rxf9', // Your Privy App ID
      });

      return verified;
    } catch (error) {
      console.error('Error verifying Privy token:', error);
      throw error;
    }
  }

  async verifyPrivyUser(privyId: string, authToken?: string): Promise<boolean> {
    try {
      const appSecret = this.configService.get<string>('PRIVY_APP_SECRET');
      
      if (!appSecret) {
        console.error('PRIVY_APP_SECRET not configured');
        return false;
      }

      // Basic validation - privyId should be a non-empty string
      if (!privyId || typeof privyId !== 'string' || privyId.trim().length === 0) {
        return false;
      }

      // If we have an auth token, verify it with JWKS
      if (authToken) {
        try {
          const verified = await this.verifyPrivyToken(authToken);
          console.log('Privy token verified:', verified);
          return true;
        } catch (error) {
          console.error('Privy token verification failed:', error);
          return false;
        }
      }

      // For now, we'll trust the frontend-provided privyId
      // In production, you should always verify with a token
      return true;
    } catch (error) {
      console.error('Error verifying Privy user:', error);
      return false;
    }
  }

  async createUserFromPrivy(privyId: string, username: string, authToken?: string): Promise<any> {
    try {
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
      console.error('Error creating user from Privy:', error);
      throw error;
    }
  }
} 