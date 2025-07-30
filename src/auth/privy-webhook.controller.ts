import { Controller, Post, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { PrivyAuthService } from './privy-auth.service';
import { UsersService } from '../Users/users.service';

@Controller('webhooks/privy')
export class PrivyWebhookController {
  constructor(
    private readonly privyAuthService: PrivyAuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('user-created')
  async handleUserCreated(
    @Body() body: any,
    @Headers('privy-signature') signature: string,
  ) {
    try {
      console.log('🔔 Privy webhook received:', body);
      
      // Verify the webhook signature (you should implement this)
      // const isValid = await this.verifyWebhookSignature(signature, body);
      // if (!isValid) {
      //   throw new HttpException('Invalid webhook signature', HttpStatus.UNAUTHORIZED);
      // }

      const { user } = body;
      
      if (!user || !user.id) {
        throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
      }

      console.log('👤 Creating user from Privy webhook:', user.id);

      // Check if user already exists
      const existingUser = await this.usersService.findByPrivyId(user.id);
      if (existingUser) {
        console.log('✅ User already exists:', user.id);
        return { success: true, message: 'User already exists' };
      }

      // Create user with default username (user can update later)
      const defaultUsername = `user_${user.id.slice(0, 8)}`;
      
      const userData = await this.privyAuthService.createUserFromPrivy(
        user.id,
        defaultUsername,
      );

      const newUser = await this.usersService.create(userData);
      
      console.log('✅ User created from webhook:', newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('❌ Webhook error:', error);
      throw new HttpException(
        'Webhook processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('user-updated')
  async handleUserUpdated(
    @Body() body: any,
    @Headers('privy-signature') signature: string,
  ) {
    try {
      console.log('🔄 Privy user updated webhook:', body);
      
      const { user } = body;
      
      if (!user || !user.id) {
        throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
      }

      // Update user data if needed
      const existingUser = await this.usersService.findByPrivyId(user.id);
      if (existingUser) {
        // Update user data here if needed
        console.log('✅ User updated from webhook:', user.id);
      }

      return { success: true };
    } catch (error) {
      console.error('❌ User update webhook error:', error);
      throw new HttpException(
        'Webhook processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 