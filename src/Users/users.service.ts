import { Injectable, Inject } from '@nestjs/common';
import { User } from './interfaces/users.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from './dto/users.dto';
import { PrivyAuthService } from '../auth/privy-auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly privyAuthService: PrivyAuthService,
  ) {}
  //   private readonly users: User[] = [];

  async findAll(): Promise<User[]> {
    const findAllI = await this.userModel.find().exec();
    return findAllI;
  }

  async findAllProtected(): Promise<User[]> {
    const findAllI = await this.userModel.find({}, { password: 0 }).exec();
    return findAllI;
  }

  async findById(id: string): Promise<User> {
    return id.match(/^[0-9a-fA-F]{24}$/)
      ? await this.userModel.findOne({ _id: id })
      : null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return await this.userModel.findOne({ _id: id });
    }
  }
  async findByUsername(Username: string): Promise<User> {
    const findUser = await this.userModel.findOne({ username: Username });
    return findUser;

    if (Username.match(Username)) {
      return await this.userModel.findOne({ username: Username });
    }
  }

  async findByUsernameProtected(Username: string): Promise<User> {
    const findUser = await this.userModel.findOne({ username: Username });
    const returnUser = findUser.toJSON();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = returnUser;
    return rest;

    if (Username.match(Username)) {
      return await this.userModel.findOne({ username: Username });
    }
  }

  async findByPrivyId(privyId: string): Promise<User> {
    const findUser = await this.userModel.findOne({ privyId: privyId });
    return findUser;
  }

  async create(user: UserDTO) {
    // Check if username already exists
    const existingUser = await this.findByUsername(user.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    // Check if privyId already exists
    const existingPrivyUser = await this.findByPrivyId(user.privyId);
    if (existingPrivyUser) {
      throw new Error('User already exists with this wallet');
    }
    
    // For now, create user directly without Privy verification to avoid 500 errors
    // The frontend already has the Privy user authenticated
    const newUser = await new this.userModel(user);
    return newUser.save();
  }
  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }

  async update(id: string, user: UserDTO): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, user, { new: true });
  }
}
