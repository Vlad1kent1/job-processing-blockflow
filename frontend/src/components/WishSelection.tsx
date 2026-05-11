'use client';

import { motion } from 'framer-motion';
import { useOnboardingStore } from '../store/useOnboardingStore';

const wishOptions = ['wish1', 'wish2', 'wish3', 'wish4', 'wish5'];

export default function WishSelection() {
  const selectedWish = useOnboardingStore((state) => state.selectedWish);
  const setSelectedWish = useOnboardingStore((state) => state.setSelectedWish);
  const setStep = useOnboardingStore((state) => state.setStep);

  const handleSelectWish = (wish: string) => {
    setSelectedWish(wish);
    setStep(2);
  };

  return (
    <div className="mx-auto flex items-center w-full max-w-360 flex-col px-8 py-8 sm:px-10 sm:py-10">
      <h1 className="text-[36px] font-normal text-[#141415] font-heading">What is your main wish?</h1>

      <div className="mt-10 flex w-full flex-col gap-4">
        {wishOptions.map((wish) => {
          return (
            <motion.button
              key={wish}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectWish(wish)}
              className="flex items-center rounded-2xl border border-[#F1F0F6] bg-white px-4 py-3 text-left transition-shadow duration-200 hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
              style={{ boxShadow: '1px 1px 8px 2px rgba(0,0,0,0.04)' }}
            >
              <span className="text-[22px] font-normal text-[#141415] font-heading">{wish}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
