import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from 'src/Users/users.service';
import { UserDTO } from 'src/Users/dto/users.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.body);
  }
  @Post('register')
  async registerUser(@Body() createUserDto: UserDTO) {
    return await this.usersService.create(createUserDto);
  }
}
