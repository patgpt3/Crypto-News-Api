import { Injectable } from '@nestjs/common';
import { Get, Inject } from '@nestjs/common';

import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/Users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
// import * as jwt from 'jsonwebtoken';
import { User } from 'src/Users/interfaces/users.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    private logger: LoggerService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async validateUser(username: string, password: string) {
    this.logger.debug('Validate User Endpoint');

    const user = await this.usersService.findByUsername(username);
    const hash = await bcrypt.hash(user.password, 10);
    const comp = await bcrypt.compare(password, hash);

    if (user && comp) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
    // return fa;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: {
        name: user.username,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    // const secretKey = process.env.jwt_secret;
    return {
      ...result,
      accesstoken: this.jwtService.sign(payload),
    };
  }
}
