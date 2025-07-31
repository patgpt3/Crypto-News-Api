import { JobDTO } from './dto/jobs.dto';
import { Job } from './interfaces/jobs.interface';
import { LoggerService } from 'src/logger/logger.service';
import { JobsService } from './jobs.service';
export declare class JobsController {
    private jobsService;
    private logger;
    constructor(jobsService: JobsService, logger: LoggerService);
    findAll(): Promise<Job[]>;
    findById(param: any): Promise<Job>;
    findbyIds(idsObj: {
        jobs: string[];
    }): Promise<Job[]>;
    findAllNewest(): Promise<Job[]>;
    findAllNewestPagination(param: any, page: {
        pageNumber: number;
    }): Promise<Job[]>;
    findAllNewestPaginationByCategory(param: any, page: {
        pageNumber: number;
        cat: string;
    }): Promise<Job[]>;
    create(jobDTO: JobDTO): Promise<Job>;
    update(param: any, jobDTO: JobDTO): Promise<Job>;
    delete(param: any): Promise<Job>;
}
