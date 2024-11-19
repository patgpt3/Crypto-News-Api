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
import { JobDTO } from './dto/jobs.dto';
import { Job } from './interfaces/jobs.interface';
import { LoggerService } from 'src/logger/logger.service';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(
    @Inject(JobsService) private jobsService: JobsService,
    private logger: LoggerService,
  ) {}

  @Get()
  async findAll(): Promise<Job[]> {
    this.logger.debug('Get All jobs Endpoint');
    const fa = await this.jobsService.findAll();
    return fa;
  }

  @Get(':id')
  async findById(@Param() param): Promise<Job> {
    this.logger.debug('Get Job by ID Endpoint');
    return this.jobsService.findById(param.id);
  }

  @Post('jobs/findbyIds')
  async findbyIds(@Body() idsObj: { jobs: string[] }): Promise<Job[]> {
    this.logger.debug('Get All jobs by Ids Endpoint');
    const results = [];

    const ids = idsObj.jobs;
    console.log(ids);

    for (const id of ids) {
      try {
        console.log(id);
        const data = await this.jobsService.findById(id);
        console.log(data);
        results.push(data);
      } catch (error) {
        console.error(`Error fetching data for ID ${id}:`, error);
      }
    }

    return results;
  }

  @Get('jobs/newest')
  async findAllNewest(): Promise<Job[]> {
    this.logger.debug('Get All Newest Jobs Endpoint');
    const fa = await this.jobsService.findAllNewest();
    return fa;
  }

  @Put('jobs/newest/pages')
  async findAllNewestPagination(
    @Param() param,
    @Body() page: { pageNumber: number },
  ): Promise<Job[]> {
    this.logger.debug('Get All New Jobs Pages Endpoint');
    const fa = await this.jobsService.findAllNewestPagination(page.pageNumber);
    return fa;
  }

  @Post()
  async create(@Body() jobDTO: JobDTO): Promise<Job> {
    this.logger.debug('Create Job Endpoint');
    const createI = await this.jobsService.create(jobDTO);
    return createI;
  }
  @Put(':id')
  async update(@Param() param, @Body() jobDTO: JobDTO): Promise<Job> {
    this.logger.debug('Update jobs Endpoint');
    return this.jobsService.update(param.id, jobDTO);
  }

  @Delete(':id')
  async delete(@Param() param): Promise<Job> {
    this.logger.debug('Delete Job Endpoint');
    return this.jobsService.delete(param.id);
  }
}
