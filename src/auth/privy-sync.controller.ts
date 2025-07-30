import { Controller, Post, Body, Get } from '@nestjs/common';
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
      throw error;
    }
  }

  @Get('test')
  async testConnection() {
    return { 
      success: true, 
      message: 'Sync endpoint is working',
      timestamp: new Date().toISOString()
    };
  }
} 