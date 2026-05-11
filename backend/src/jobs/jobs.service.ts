import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PipelineExecutor } from './pipeline/pipeline.executor';
import { JobsGateway } from './jobs.gateway';
import { JobStatus } from '@prisma/client';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pipelineExecutor: PipelineExecutor,
    private readonly gateway: JobsGateway,
  ) {}

  async createJob(createJobDto: CreateJobDto): Promise<{ id: string }> {
    const job = await this.prisma.job.create({
      data: {
        status: JobStatus.queued,
        progress: 0,
        selectedWish: createJobDto.selectedWish,
        inputValue: createJobDto.inputValue,
      },
    });

    await this.gateway.sendJobUpdate(job.id);

    void this.pipelineExecutor.execute(job.id).catch(() => {
      // The pipeline handles updating the job to failed when necessary.
    });

    return { id: job.id };
  }

  async getJob(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException(`Job ${id} not found`);
    }

    return job;
  }
}
