import { create } from 'zustand';

export type JobStatus = 'idle' | 'queued' | 'processing' | 'done' | 'failed';
export type Method = 'ws' | 'http' | null;
export type WeightUnit = 'lbs' | 'kg';

interface OnboardingState {
  step: number;
  selectedWish: string;
  currentWeight: number | null;
  goalWeight: number | null;
  unit: WeightUnit;
  jobId: string | null;
  progress: number;
  jobStatus: JobStatus;
  method: Method;
  result: string;
  isPolling: boolean;
  setStep: (step: number) => void;
  setSelectedWish: (wish: string) => void;
  setCurrentWeight: (value: number | null) => void;
  setGoalWeight: (value: number | null) => void;
  setUnit: (unit: WeightUnit) => void;
  setJobId: (jobId: string | null) => void;
  setProgress: (progress: number) => void;
  setJobStatus: (status: JobStatus) => void;
  setMethod: (method: Method) => void;
  setResult: (result: string) => void;
  setIsPolling: (isPolling: boolean) => void;
  resetToStep2: () => void;
  resetAll: () => void;
}

function convertLbsToKg(value: number | null) {
  return value === null ? null : Math.round(value * 0.453592);
}

function convertKgToLbs(value: number | null) {
  return value === null ? null : Math.round(value * 2.20462);
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  selectedWish: '',
  currentWeight: null,
  goalWeight: null,
  unit: 'lbs',
  jobId: null,
  progress: 0,
  jobStatus: 'idle',
  method: null,
  result: '',
  isPolling: false,
  setStep: (step) => set({ step }),
  setSelectedWish: (wish) => set({ selectedWish: wish }),
  setCurrentWeight: (value) => set({ currentWeight: value }),
  setGoalWeight: (value) => set({ goalWeight: value }),
  setUnit: (unit) =>
    set((state) => {
      if (state.unit === unit) {
        return { unit };
      }

      return {
        unit,
        currentWeight: unit === 'lbs' ? convertKgToLbs(state.currentWeight) : convertLbsToKg(state.currentWeight),
        goalWeight: unit === 'lbs' ? convertKgToLbs(state.goalWeight) : convertLbsToKg(state.goalWeight),
      };
    }),
  setJobId: (jobId) => set({ jobId }),
  setProgress: (progress) => set({ progress }),
  setJobStatus: (status) => set({ jobStatus: status }),
  setMethod: (method) => set({ method }),
  setResult: (result) => set({ result }),
  setIsPolling: (isPolling) => set({ isPolling }),
  resetToStep2: () =>
    set({
      step: 2,
      jobId: null,
      progress: 0,
      jobStatus: 'idle',
      method: null,
      result: '',
      isPolling: false,
    }),
  resetAll: () =>
    set({
      step: 1,
      selectedWish: '',
      currentWeight: null,
      goalWeight: null,
      unit: 'lbs',
      jobId: null,
      progress: 0,
      jobStatus: 'idle',
      method: null,
      result: '',
      isPolling: false,
    }),
}));
