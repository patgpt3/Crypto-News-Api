import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Inject,
  Put,
  Delete,
} from '@nestjs/common';
import { UserDTO } from './dto/users.dto';
import { User } from './interfaces/users.interface';
import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    private logger: LoggerService,
  ) {}

  @Get('admin')
  async findAll(): Promise<User[]> {
    this.logger.debug('Get All users Endpoint');
    const fa = await this.usersService.findAll();
    return fa;
  }

  @Get()
  async findAllProtected(): Promise<User[]> {
    this.logger.debug('Get All users protexted Endpoint');
    const fa = await this.usersService.findAllProtected();
    return fa;
  }

  @Get(':id')
  async findById(@Param() param): Promise<User> {
    this.logger.debug('Get User by ID Endpoint');
    return this.usersService.findById(param.id);
  }

  @Get('find/:username')
  async findByUsername(@Param() param): Promise<User> {
    this.logger.debug('Get User by username Endpoint');
    return this.usersService.findByUsername(param.username);
  }
  @Get('findProtected/:username')
  async findByUsernameProtected(@Param() param): Promise<User> {
    this.logger.debug('Get User by username Endpoint');
    return this.usersService.findByUsernameProtected(param.username);
  }

  @Post()
  async create(@Body() userDTO: UserDTO): Promise<User> {
    this.logger.debug('Create User Endpoint');
    const createI = await this.usersService.create(userDTO);
    return createI;
  }
  @Put(':id')
  async update(@Param() param, @Body() userDTO: UserDTO): Promise<User> {
    this.logger.debug('Update users Endpoint');
    return this.usersService.update(param.id, userDTO);
  }

  @Delete(':id')
  async delete(@Param() param): Promise<User> {
    this.logger.debug('Delete User Endpoint');
    return this.usersService.delete(param.id);
  }
}
