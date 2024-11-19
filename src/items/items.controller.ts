import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Inject,
  Put,
  Delete,
  // UseGuards,
} from '@nestjs/common';
import { ItemDTO } from './dto/item.dto';
import { ItemsService } from './items.service';
import { Item } from './interfaces/item.interface';
import { LoggerService } from 'src/logger/logger.service';
// import { UsersService } from 'src/Users/users.service';
// import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('items')
export class ItemsController {
  constructor(
    @Inject(ItemsService) private itemsService: ItemsService,
    private logger: LoggerService,
    // private usersService: UsersService,
  ) {}

  // @UseGuards(JwtGuard)
  @Get()
  async findAll(): Promise<Item[]> {
    this.logger.debug('Get All Items Endpoint');
    const fa = await this.itemsService.findAll();
    return fa;
  }
  @Get('past')
  async findAllPast(): Promise<Item[]> {
    this.logger.debug('Get All Items Past Endpoint');
    const fa = await this.itemsService.findAllPast();
    return fa;
  }

  @Get('newest')
  async findAllNewest(): Promise<Item[]> {
    this.logger.debug('Get All Newest Items Endpoint');
    const fa = await this.itemsService.findAllNewest();
    return fa;
  }
  @Get('main')
  async findAllMain(): Promise<Item[]> {
    this.logger.debug('Get All Main Items Endpoint');
    const fa = await this.itemsService.findAllMain();
    return fa;
  }

  @Put('main/pages')
  async findAllMainPagination(
    @Param() param,
    @Body() page: { pageNumber: number },
  ): Promise<Item[]> {
    this.logger.debug('Get All Main Items Pages Endpoint');
    const fa = await this.itemsService.findAllMainPagination(page.pageNumber);
    return fa;
  }

  @Put('newest/pages')
  async findAllNewestPagination(
    @Param() param,
    @Body() page: { pageNumber: number },
  ): Promise<Item[]> {
    this.logger.debug('Get All New Items Pages Endpoint');
    const fa = await this.itemsService.findAllNewestPagination(page.pageNumber);
    return fa;
  }

  @Put('ask/pages')
  async findAllAskPagination(
    @Param() param,
    @Body() page: { pageNumber: number },
  ): Promise<Item[]> {
    this.logger.debug('Get All Ask Items Pages Endpoint');
    const fa = await this.itemsService.findAllAskPagination(page.pageNumber);
    return fa;
  }

  @Put('show/pages')
  async findAllShowPagination(
    @Param() param,
    @Body() page: { pageNumber: number },
  ): Promise<Item[]> {
    this.logger.debug('Get All Show Items Pages Endpoint');
    const fa = await this.itemsService.findAllShowPagination(page.pageNumber);
    return fa;
  }

  @Get('show')
  async findAllShow(): Promise<Item[]> {
    this.logger.debug('Get All Show Items Endpoint');
    const fa = await this.itemsService.findAllShow();
    return fa;
  }

  @Get('ask')
  async findAllAsk(): Promise<Item[]> {
    this.logger.debug('Get All Ask Items Endpoint');
    const fa = await this.itemsService.findAllAsk();
    return fa;
  }

  @Put('upVote/:id')
  async upVote(
    @Param() param,
    @Body() currentUser: { currentUserName: string },
  ): Promise<Item> {
    this.logger.debug('upVote Endpoint');
    const fa = await this.itemsService.upVote(param.id, currentUser);
    return fa;
  }

  @Put('downVote/:id')
  async downVote(
    @Param() param,
    @Body() currentUser: { currentUserName: string },
  ): Promise<Item> {
    this.logger.debug('Down Vote Endpoint');
    const fa = await this.itemsService.downVote(param.id, currentUser);
    return fa;
  }

  @Get(':id')
  async findById(@Param() param): Promise<Item> {
    this.logger.debug('Get Item by ID Endpoint');
    return this.itemsService.findById(param.id);
  }
  @Post('items/findbyIds')
  async findbyIds(@Body() idsObj: { items: string[] }): Promise<Item[]> {
    this.logger.debug('Get All Items by Ids Endpoint');
    const results = [];

    const ids = idsObj.items;
    console.log(ids);

    for (const id of ids) {
      try {
        console.log(id);
        const data = await this.itemsService.findById(id);
        console.log(data);
        results.push(data);
      } catch (error) {
        console.error(`Error fetching data for ID ${id}:`, error);
      }
    }

    return results;
  }

  @Post()
  async create(@Body() itemDTO: ItemDTO): Promise<Item> {
    this.logger.debug('Create Item Endpoint');
    const createI = await this.itemsService.create(itemDTO);
    return createI;
  }
  @Put(':id')
  async update(@Param() param, @Body() itemDTO: ItemDTO): Promise<Item> {
    this.logger.debug('Update Items Endpoint');
    return this.itemsService.update(param.id, itemDTO);
  }

  @Delete(':id')
  async delete(@Param() param): Promise<Item> {
    this.logger.debug('Delete Item Endpoint');
    return this.itemsService.delete(param.id);
  }
}
