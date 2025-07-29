import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { LoggerService } from '../logger/logger.service';
import { PrivyAuthService } from '../auth/privy-auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, LoggerService, PrivyAuthService],
  exports: [UsersService],
})
export class UsersModule {}
