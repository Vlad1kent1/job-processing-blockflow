"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import WishSelection from '../components/WishSelection';
import WeightEntry from '../components/WeightEntry';
import GoalWeight from '../components/GoalWeight';
import JobRunner from '../components/JobRunner';
import { useOnboardingStore } from '../store/useOnboardingStore';

export default function Home() {
  const step = useOnboardingStore((state) => state.step);
  const setStep = useOnboardingStore((state) => state.setStep);
  const progressValue = Math.round((step / 4) * 100);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8FB]">
      <header className="flex items-center h-[72px] bg-white border-b border-[#DAD9E0] px-[120px]">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className="flex h-12 w-12 items-center justify-center rounded-full transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-[1024px]">
            <div className="h-2 rounded-[8px] bg-[#F1F0F6] overflow-hidden">
              <div
                className="h-full rounded-[4px] transition-all duration-300 ease-out"
                style={{
                  width: `${progressValue}%`,
                  background: 'linear-gradient(90deg, #1FA9C7 0%, #1BB97C 100%)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="h-12 w-12" />
      </header>

      <div className="flex flex-col flex-grow min-h-[calc(100vh-72px)]">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center flex-grow w-full"
            >
              <WishSelection />
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center flex-grow w-full"
            >
              <WeightEntry />
            </motion.div>
          ) : step === 3 ? (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center flex-grow w-full"
            >
              <GoalWeight />
            </motion.div>
          ) : (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center flex-grow w-full"
            >
              <JobRunner />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
