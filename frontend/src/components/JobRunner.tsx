'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { useJobExecution } from '../hooks/useJobExecution';

export default function JobRunner() {
  const selectedWish = useOnboardingStore((state) => state.selectedWish);
  const currentWeight = useOnboardingStore((state) => state.currentWeight);
  const goalWeight = useOnboardingStore((state) => state.goalWeight);
  const unit = useOnboardingStore((state) => state.unit);
  const progress = useOnboardingStore((state) => state.progress);
  const jobStatus = useOnboardingStore((state) => state.jobStatus);
  const jobId = useOnboardingStore((state) => state.jobId);
  const isPolling = useOnboardingStore((state) => state.isPolling);

  const { startWebSocketJob, startHttpJob, resetJob } = useJobExecution();

  const progressValue = useMemo(() => Math.round(Math.max(0, Math.min(100, progress || 0))), [progress]);

  const canStart = Boolean(jobId);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl px-8 py-8 space-y-8">
      <div className="space-y-4 text-center w-full">
        <h1 className="text-[36px] font-normal text-[#141415] font-heading">Run the job and watch progress</h1>
        <p className="text-base leading-7 text-[#646271] font-body">
          Execute the workflow and see how your job updates in real time.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start w-full">
        <div className="rounded-3xl border border-[#F1F0F6] bg-[#F8F8FB] p-8 shadow-[1px_1px_8px_2px_rgba(0,0,0,0.04)]">
          <div className="space-y-6">
            <div className="rounded-[22px] border border-[#E3E3E3] bg-white p-6 shadow-sm">
              <p className="text-sm text-[#82818C] font-body">Selected wish</p>
              <p className="mt-3 text-xl font-semibold text-[#141415] font-body">{selectedWish || 'No wish selected'}</p>
            </div>
            <div className="rounded-[22px] border border-[#E3E3E3] bg-white p-6 shadow-sm">
              <p className="text-sm text-[#82818C] font-body">Current weight</p>
              <p className="mt-3 text-xl font-semibold text-[#141415] font-body">
                {currentWeight ?? '--'} {unit}
              </p>
            </div>
            <div className="rounded-[22px] border border-[#E3E3E3] bg-white p-6 shadow-sm">
              <p className="text-sm text-[#82818C] font-body">Goal weight</p>
              <p className="mt-3 text-xl font-semibold text-[#141415] font-body">
                {goalWeight ?? '--'} {unit}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#F1F0F6] bg-white p-8 text-center shadow-[1px_1px_8px_2px_rgba(0,0,0,0.04)]">
          <div className="relative mx-auto mb-8 h-70 w-70">
            <svg className="h-full w-full" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="100" stroke="#F1F0F6" strokeWidth="10" fill="none" />
              <motion.circle
                cx="110"
                cy="110"
                r="100"
                stroke="#1BB97C"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={628}
                strokeDashoffset={628 - (628 * progressValue) / 100}
                initial={{ strokeDashoffset: 628 }}
                animate={{ strokeDashoffset: 628 - (628 * progressValue) / 100 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="origin-center -rotate-90"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-[56px] font-heading text-[#099678]">{progressValue}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              disabled={!canStart}
              onClick={startWebSocketJob}
              className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition ${
                canStart
                  ? 'bg-linear-to-r from-[#1FA9C7] to-[#1BB97C] hover:brightness-110'
                  : 'cursor-not-allowed bg-slate-200 text-slate-500'
              }`}
            >
              Start WS
            </button>
            <button
              type="button"
              disabled={!canStart}
              onClick={startHttpJob}
              className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition ${
                canStart
                  ? 'bg-linear-to-r from-[#1FA9C7] to-[#1BB97C] hover:brightness-110'
                  : 'cursor-not-allowed bg-slate-200 text-slate-500'
              }`}
            >
              Start HTTP Polling
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-[#D1EEC4] bg-[#EAF9E3] p-6 text-left">
            <div className="mb-4 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={18} className="text-[#FFD91A]" />
              ))}
            </div>
            <p className="text-sm font-semibold text-[#141415] font-body">John</p>
            <p className="mt-2 text-sm leading-6 text-[#575859] font-body">
              “I love this website! It makes practicing so easy and relaxing.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
