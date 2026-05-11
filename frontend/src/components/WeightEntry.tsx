'use client';

import { useOnboardingStore } from '../store/useOnboardingStore';

export default function WeightEntry() {
  const currentWeight = useOnboardingStore((state) => state.currentWeight);
  const unit = useOnboardingStore((state) => state.unit);
  const setCurrentWeight = useOnboardingStore((state) => state.setCurrentWeight);
  const setUnit = useOnboardingStore((state) => state.setUnit);
  const setGoalWeight = useOnboardingStore((state) => state.setGoalWeight);
  const setStep = useOnboardingStore((state) => state.setStep);

  const minValue = unit === 'lbs' ? 22 : 10;
  const maxValue = unit === 'lbs' ? 485 : 200;

  const hasValue = typeof currentWeight === 'number' && !Number.isNaN(currentWeight);
  const isValid = hasValue && currentWeight >= minValue && currentWeight <= maxValue;
  const showError = hasValue && !isValid;

  const label = unit;

  return (
    <div className="flex flex-col items-center w-full max-w-198 px-8 py-8 space-y-8">
      <div className="space-y-4 text-center w-full">
        <h1 className="text-[36px] font-normal text-[#141415] font-heading">What is your weight?</h1>
      </div>

      <div className="flex flex-col items-center space-y-6 rounded-[20px] border border-[#F1F0F6] bg-[#F8F8FB] p-8 w-full">
        <div className="flex items-center justify-center w-fit gap-2 rounded-full bg-white p-1 shadow-sm shadow-slate-200">
          {(['lbs', 'kg'] as const).map((tab) => {
            const active = tab === unit;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setUnit(tab)}
                className={`min-w-23 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? 'bg-[#1BB97C] text-white' : 'text-[#646271]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-end gap-2">
            <input
              type="number"
              min="0"
              step="0.1"
              value={currentWeight ?? ''}
              onChange={(event) => {
                const parsed = Number(event.target.value);
                setCurrentWeight(Number.isFinite(parsed) ? parsed : null);
              }}
              placeholder="0"
              className={`w-44 text-center text-[44px] font-semibold text-[#141415] outline-none ${
                showError ? 'border-b border-[#FF5C5C]' : 'border-b border-[#555557]'
              } bg-transparent`}
            />
            <span className="text-[44px] font-semibold text-[#141415]">{label}</span>
          </div>
          <p className={`text-sm ${showError ? 'text-[#FF5C5C]' : 'text-[#82818C]'} font-body`}>
            {showError
              ? `Please enter a value between ${minValue} ${label} and ${maxValue} ${label}`
              : `Please enter a value between ${minValue} ${label} and ${maxValue} ${label}`}
          </p>
        </div>
      </div>

      <div className="w-full">
        <button
          type="button"
          disabled={!isValid}
          onClick={() => {
            if (!isValid || currentWeight === null) return;
            const targetWeight = Math.round(currentWeight * 0.95);
            setGoalWeight(targetWeight);
            setStep(3);
          }}
          className={`w-full inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
            isValid
              ? 'bg-linear-to-r from-[#1FA9C7] to-[#1BB97C] hover:brightness-110'
              : 'cursor-not-allowed bg-slate-200 text-slate-500'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
