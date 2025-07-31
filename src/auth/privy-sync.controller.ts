import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrivyAuthService } from './privy-auth.service';
import { UsersService } from '../Users/users.service';

@Controller('sync')
export class PrivySyncController {
  constructor(
    private readonly privyAuthService: PrivyAuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('create-user')
  async createUserInPrivy(@Body() body: { privyId: string; username: string; email?: string }) {
    try {
      console.log('🔄 Creating user in Privy:', body);
      
      // Validate input
      if (!body.privyId || !body.username) {
        throw new HttpException('privyId and username are required', HttpStatus.BAD_REQUEST);
      }
      
      // Check if user already exists in our database
      const existingUser = await this.usersService.findByPrivyId(body.privyId);
      if (existingUser) {
        console.log('✅ User already exists in database:', body.privyId);
        return { success: true, message: 'User already exists', user: existingUser };
      }

      // Create user data
      const userData = {
        privyId: body.privyId,
        username: body.username,
        points: 0,
        isFlagged: 0,
        submissions: [],
        comments: [],
        upvotedSubmissions: [],
        jobs: [],
        replies: []
      };

      // Save to our database
      const newUser = await this.usersService.create(userData);
      
      console.log('✅ User created in database:', newUser);
      
      // Try to sync with Privy API if we have the key
      try {
        const privyUser = await this.privyAuthService.getUserFromPrivy(body.privyId);
        console.log('✅ User verified in Privy:', privyUser);
      } catch (error) {
        console.log('⚠️ Could not verify with Privy API (this is okay):', error.message);
      }
      
      return { 
        success: true, 
        message: 'User created successfully',
        user: newUser 
      };
    } catch (error) {
      console.error('❌ Error creating user:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('test')
  async testConnection() {
    return { 
      success: true, 
      message: 'Sync endpoint is working',
      timestamp: new Date().toISOString(),
      privyConfigured: !!process.env.PRIVY_API_KEY
    };
  }

  @Get('health')
  async healthCheck() {
    try {
      // Test database connection by trying to find users
      const userCount = await this.usersService.findAll();
      const dbStatus = { connected: true, userCount: userCount.length };
      
      // Test Privy configuration
      const privyStatus = {
        apiKeyConfigured: !!process.env.PRIVY_API_KEY,
        appIdConfigured: !!process.env.PRIVY_APP_ID,
        appId: process.env.PRIVY_APP_ID || 'cm4g4hzw102g3hlf5jgx0rxf9'
      };
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        database: dbStatus,
        privy: privyStatus,
        environment: {
          nodeEnv: process.env.NODE_ENV,
          port: process.env.PORT || 3000
        }
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
} 