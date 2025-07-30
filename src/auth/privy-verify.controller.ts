import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PrivyAuthService } from './privy-auth.service';
import { UsersService } from '../Users/users.service';

@Controller('privy')
export class PrivyVerifyController {
  constructor(
    private readonly privyAuthService: PrivyAuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('verify-user')
  async verifyAndCreateUser(@Body() body: { privyId: string; username: string; authToken?: string }) {
    try {
      console.log('🔍 Verifying Privy user:', body.privyId);
      
      // Check if user already exists
      const existingUser = await this.usersService.findByPrivyId(body.privyId);
      if (existingUser) {
        console.log('✅ User already exists:', body.privyId);
        return { 
          success: true, 
          message: 'User already exists',
          user: existingUser 
        };
      }

      // Verify the Privy user
      const isValid = await this.privyAuthService.verifyPrivyUser(body.privyId, body.authToken);
      if (!isValid) {
        throw new Error('Invalid Privy user');
      }

      // Create user data
      const userData = await this.privyAuthService.createUserFromPrivy(
        body.privyId,
        body.username,
        body.authToken
      );

      // Save to database
      const newUser = await this.usersService.create(userData);
      
      console.log('✅ User verified and created:', newUser);
      
      return { 
        success: true, 
        message: 'User verified and created successfully',
        user: newUser 
      };
    } catch (error) {
      console.error('❌ User verification failed:', error);
      throw error;
    }
  }

  @Get('user/:privyId')
  async getUserByPrivyId(@Param('privyId') privyId: string) {
    try {
      const user = await this.usersService.findByPrivyId(privyId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, user };
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      throw error;
    }
  }

  @Post('sync-users')
  async syncUsers(@Body() body: { privyIds: string[] }) {
    try {
      console.log('🔄 Syncing users:', body.privyIds);
      
      const results = [];
      for (const privyId of body.privyIds) {
        try {
          const user = await this.usersService.findByPrivyId(privyId);
          if (user) {
            results.push({ privyId, status: 'exists', user });
          } else {
            results.push({ privyId, status: 'missing' });
          }
        } catch (error) {
          results.push({ privyId, status: 'error', error: error.message });
        }
      }
      
      return { success: true, results };
    } catch (error) {
      console.error('❌ User sync failed:', error);
      throw error;
    }
  }
} 