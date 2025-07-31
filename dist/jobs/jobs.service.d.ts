import { Job } from './interfaces/jobs.interface';
import { Model } from 'mongoose';
import { JobDTO } from './dto/jobs.dto';
import { UsersService } from 'src/Users/users.service';
export declare class JobsService {
    private readonly jobModel;
    private usersService;
    constructor(jobModel: Model<Job>, usersService: UsersService);
    findAll(): Promise<Job[]>;
    findAllNewest(): Promise<Job[]>;
    findAllNewestPagination(page: number): Promise<Job[]>;
    findAllNewestPaginationByCategory(page: number, category: string): Promise<Job[]>;
    findById(id: string): Promise<Job>;
    create(job: JobDTO): Promise<import("mongoose").Document<unknown, {}, Job> & Job & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(id: string): Promise<Job>;
    update(id: string, job: JobDTO): Promise<Job>;
}
