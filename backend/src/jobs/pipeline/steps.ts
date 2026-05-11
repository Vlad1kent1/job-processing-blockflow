import { Job } from '@prisma/client';

export type PipelineStep = (job: Job) => Promise<unknown>;

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export async function validateData(job: Job): Promise<void> {
  await delay(600);
  return;
}

export async function processCalculations(job: Job): Promise<void> {
  await delay(900);
  return;
}

export async function generateResult(job: Job): Promise<string> {
  await delay(700);
  return `Generated result for job ${job.id}`;
}

export const jobPipelineSteps: PipelineStep[] = [
  validateData,
  processCalculations,
  generateResult,
];
