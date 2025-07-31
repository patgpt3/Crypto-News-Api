import { ItemDTO } from './dto/item.dto';
import { ItemsService } from './items.service';
import { Item } from './interfaces/item.interface';
import { LoggerService } from 'src/logger/logger.service';
export declare class ItemsController {
    private itemsService;
    private logger;
    constructor(itemsService: ItemsService, logger: LoggerService);
    findAll(): Promise<Item[]>;
    findAllPast(): Promise<Item[]>;
    findAllNewest(): Promise<Item[]>;
    findAllMain(): Promise<Item[]>;
    findAllMainPagination(param: any, page: {
        pageNumber: number;
    }): Promise<Item[]>;
    findAllMainPaginationByCategory(param: any, page: {
        pageNumber: number;
        cat: string;
    }): Promise<Item[]>;
    findAllNewestPagination(param: any, page: {
        pageNumber: number;
    }): Promise<Item[]>;
    findAllNewestPaginationByCategory(param: any, page: {
        pageNumber: number;
        cat: string;
    }): Promise<Item[]>;
    findAllAskPagination(param: any, page: {
        pageNumber: number;
    }): Promise<Item[]>;
    findAllAskPaginationByCategory(param: any, page: {
        pageNumber: number;
        cat: string;
    }): Promise<Item[]>;
    findAllShowPagination(param: any, page: {
        pageNumber: number;
    }): Promise<Item[]>;
    findAllShowPaginationByCategory(param: any, page: {
        pageNumber: number;
        cat: string;
    }): Promise<Item[]>;
    findAllShow(): Promise<Item[]>;
    findAllAsk(): Promise<Item[]>;
    upVote(param: any, currentUser: {
        currentUserName: string;
    }): Promise<Item>;
    downVote(param: any, currentUser: {
        currentUserName: string;
    }): Promise<Item>;
    findById(param: any): Promise<Item>;
    findbyIds(idsObj: {
        items: string[];
    }): Promise<Item[]>;
    create(itemDTO: ItemDTO): Promise<Item>;
    update(param: any, itemDTO: ItemDTO): Promise<Item>;
    delete(param: any): Promise<Item>;
}
