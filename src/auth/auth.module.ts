import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/Users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './stratagies/local-strategy';
import { UserSchema } from 'src/Users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './stratagies/jwt-strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions: { expiresIn: '3600' },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoggerService,
    UsersService,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
