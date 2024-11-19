import { Inject, Injectable } from '@nestjs/common';
import { Job } from './interfaces/jobs.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JobDTO } from './dto/jobs.dto';
import { UsersService } from 'src/Users/users.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel('Job') private readonly jobModel: Model<Job>,
    @Inject(UsersService) private usersService: UsersService,
  ) {}
  //   private readonly jobs: Job[] = [];

  async findAll(): Promise<Job[]> {
    const findAllI = await this.jobModel.find().exec();
    return findAllI;
  }

  async findAllNewest(): Promise<Job[]> {
    const findAllj = await this.jobModel.find().exec();
    const jobsNewest = findAllj.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    return jobsNewest;
  }

  async findAllNewestPagination(page: number): Promise<Job[]> {
    const pageSize = 30;
    const skip = page * pageSize;

    const itemsMain = await this.jobModel
      .find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return itemsMain;
  }

  async findById(id: string): Promise<Job> {
    return id.match(/^[0-9a-fA-F]{24}$/)
      ? await this.jobModel.findOne({ _id: id })
      : null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return await this.jobModel.findOne({ _id: id });
    }
  }

  async create(job: JobDTO) {
    const newJob = await new this.jobModel(job);

    //add to user
    const user = await this.usersService.findByUsername(newJob.author);
    console.log(user);
    const newUserJob = user.jobs;
    newUserJob?.push(newJob.id);
    console.log(newJob.id);
    this.usersService.update(user.id, {
      jobs: newUserJob || [newJob.id],
    });

    return newJob.save();
  }
  async delete(id: string): Promise<Job> {
    return this.jobModel.findByIdAndDelete(id);
  }

  async update(id: string, job: JobDTO): Promise<Job> {
    return await this.jobModel.findByIdAndUpdate(id, job, { new: true });
  }
}
