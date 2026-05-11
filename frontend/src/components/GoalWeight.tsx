'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';
import { useOnboardingStore } from '../store/useOnboardingStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function GoalWeight() {
  const selectedWish = useOnboardingStore((state) => state.selectedWish);
  const currentWeight = useOnboardingStore((state) => state.currentWeight);
  const goalWeight = useOnboardingStore((state) => state.goalWeight);
  const unit = useOnboardingStore((state) => state.unit);
  const setGoalWeight = useOnboardingStore((state) => state.setGoalWeight);
  const setJobId = useOnboardingStore((state) => state.setJobId);
  const setStep = useOnboardingStore((state) => state.setStep);
  const setProgress = useOnboardingStore((state) => state.setProgress);
  const setJobStatus = useOnboardingStore((state) => state.setJobStatus);
  const setMethod = useOnboardingStore((state) => state.setMethod);
  const setResult = useOnboardingStore((state) => state.setResult);
  const setIsPolling = useOnboardingStore((state) => state.setIsPolling);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (goalWeight === null && currentWeight !== null) {
      setGoalWeight(Math.round(currentWeight * 0.95));
    }
  }, [currentWeight, goalWeight, setGoalWeight]);

  const minValue = unit === 'lbs' ? 22 : 10;
  const maxValue = unit === 'lbs' ? 485 : 200;

  const hasValue = typeof goalWeight === 'number' && !Number.isNaN(goalWeight);
  const isValid = hasValue && goalWeight >= minValue && goalWeight <= maxValue;
  const showError = hasValue && !isValid;

  const handleContinue = async () => {
    if (!isValid || !selectedWish || currentWeight === null || goalWeight === null) return;
    setLoading(true);
    setErrorMessage('');
    setJobStatus('queued');
    setProgress(0);
    setMethod(null);
    setResult('');
    setIsPolling(false);

    try {
      const response = await axios.post(`${API_URL}/jobs`, {
        selectedWish,
        currentWeight,
        goalWeight,
        unit,
      });
      setJobId(response.data.id);
      setStep(4);
    } catch (error) {
      setErrorMessage('Unable to start your job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-198 px-8 py-8 space-y-8">
      <div className="space-y-4 text-center w-full">
        <h1 className="text-[36px] font-normal text-[#141415] font-heading">What is your goal weight?</h1>
      </div>

      <div className="space-y-6 rounded-[20px] border border-[#F1F0F6] bg-[#F8F8FB] p-8 text-center w-full">
        <div className="flex items-center justify-center gap-2 rounded-full bg-white p-1 shadow-sm shadow-slate-200 mx-auto w-fit">
          <span className="min-w-23 rounded-full bg-[#1BB97C] px-4 py-2 text-sm font-semibold text-white">{unit}</span>
        </div>
        <div className="flex items-end justify-center gap-3">
          <input
            type="number"
            min="0"
            step="1"
            value={goalWeight ?? ''}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              setGoalWeight(Number.isFinite(parsed) ? parsed : null);
            }}
            className={`w-44 text-center text-[44px] font-semibold text-[#141415] outline-none bg-transparent ${
              showError ? 'border-b border-[#FF5C5C]' : 'border-b border-[#555557]'
            }`}
          />
          <span className="text-[44px] font-semibold text-[#141415]">{unit}</span>
        </div>
        <p className={`text-sm ${showError ? 'text-[#FF5C5C]' : 'text-[#82818C]'} font-body`}>
          {showError
            ? `Please enter a value between ${minValue} ${unit} and ${maxValue} ${unit}`
            : `Please enter a value between ${minValue} ${unit} and ${maxValue} ${unit}`}
        </p>
      </div>

      <div className="rounded-xl border border-[#D1EEC4] bg-[#EAF9E3] p-5 text-left w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1BB97C] shadow-sm shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#141415] font-body">Goal: Lose 5% of your weight</p>
            <p className="mt-2 text-sm leading-6 text-[#575859] font-body">
              Even small, steady changes can make a meaningful difference. We&apos;ll support you with a balanced plan to help you feel lighter, healthier, and more confident over time.
            </p>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <p className="text-sm text-[#FF5C5C] font-semibold font-body">{errorMessage}</p>
      ) : null}

      <div className="w-full">
        <button
          type="button"
          disabled={!isValid || loading}
          onClick={handleContinue}
          className={`w-full inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
            isValid
              ? 'bg-linear-to-r from-[#1FA9C7] to-[#1BB97C] hover:brightness-110'
              : 'cursor-not-allowed bg-slate-200 text-slate-500'
          }`}
        >
          {loading ? 'Starting...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
