import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoggerService } from 'src/logger/logger.service';
import { UsersModule } from 'src/Users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './stratagies/local-strategy';
import { JwtStrategy } from './stratagies/jwt-strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions: { expiresIn: '3600' },
    }),
    UsersModule, // Import UsersModule instead of directly providing UsersService
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoggerService,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
