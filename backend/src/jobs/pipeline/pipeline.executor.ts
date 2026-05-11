import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JobsGateway } from '../jobs.gateway';
import { Job, JobStatus } from '@prisma/client';
import { jobPipelineSteps, PipelineStep } from './steps';

@Injectable()
export class PipelineExecutor {
  private readonly logger = new Logger(PipelineExecutor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: JobsGateway,
  ) {}

  private createStepProxy(
    step: PipelineStep,
    index: number,
    totalSteps: number,
    jobId: string,
  ) {
    return new Proxy(step, {
      apply: async (target: PipelineStep, thisArg: unknown, args: any[]) => {
        const result = await target.apply(thisArg, args);
        const progress = Math.min(
          Math.round(((index + 1) / totalSteps) * 100),
          100,
        );

        await this.prisma.job.update({
          where: { id: jobId },
          data: {
            status: JobStatus.processing,
            progress,
          },
        });

        this.gateway.emitJobUpdate(jobId, {
          id: jobId,
          status: JobStatus.processing,
          progress,
        });

        return result;
      },
    });
    }

  async execute(jobId: string) {
    const job = await this.prisma.job.findUniqueOrThrow({
      where: { id: jobId },
    });

    await this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.processing,
        progress: 0,
      },
    });

    this.gateway.emitJobUpdate(jobId, {
      id: jobId,
      status: JobStatus.processing,
      progress: 0,
    });

    let lastProgress = 0;

    try {
      const totalSteps = jobPipelineSteps.length;
      let lastResult: unknown = null;

      for (let index = 0; index < totalSteps; index += 1) {
        const step = jobPipelineSteps[index];
        const proxiedStep = this.createStepProxy(
          step,
          index,
          totalSteps,
          jobId,
        );

        lastResult = await proxiedStep(job as Job);
        lastProgress = Math.min(
          Math.round(((index + 1) / totalSteps) * 100),
          100,
        );

        if (index === totalSteps - 1 && typeof lastResult === 'string') {
          await this.prisma.job.update({
            where: { id: jobId },
            data: { result: lastResult },
          });
        }
      }

      await this.prisma.job.update({
        where: { id: jobId },
        data: {
          status: JobStatus.done,
          progress: 100,
        },
      });

      this.gateway.emitJobUpdate(jobId, {
        id: jobId,
        status: JobStatus.done,
        progress: 100,
      });
    } catch (error) {
      this.logger.error(`Job ${jobId} pipeline failed`, error as Error);

      await this.prisma.job.update({
        where: { id: jobId },
        data: {
          status: JobStatus.failed,
          progress: lastProgress,
        },
      });

      this.gateway.emitJobUpdate(jobId, {
        id: jobId,
        status: JobStatus.failed,
        progress: lastProgress,
      });
    }
  }
}
