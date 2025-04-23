import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ADDICTION_TYPES } from "@/constants/addictions";

interface AppState {
  hasOnboarded: boolean;
  addictionType: string;
  startDate: Date;
  goalDays: number;
  dailyAmount: number | null;
  dailyCost: number | null;
  
  setHasOnboarded: (value: boolean) => void;
  setAddictionType: (type: string) => void;
  setStartDate: (date: Date) => void;
  setGoalDays: (days: number) => void;
  setDailyAmount: (amount: number) => void;
  setDailyCost: (cost: number) => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      addictionType: ADDICTION_TYPES[0].id,
      startDate: new Date(),
      goalDays: 30,
      dailyAmount: null,
      dailyCost: null,
      
      setHasOnboarded: (value) => set({ hasOnboarded: value }),
      setAddictionType: (type) => set({ addictionType: type }),
      setStartDate: (date) => set({ startDate: date }),
      setGoalDays: (days) => set({ goalDays: days }),
      setDailyAmount: (amount) => set({ dailyAmount: amount }),
      setDailyCost: (cost) => set({ dailyCost: cost }),
      resetApp: () => set({
        hasOnboarded: false,
        addictionType: ADDICTION_TYPES[0].id,
        startDate: new Date(),
        goalDays: 30,
        dailyAmount: null,
        dailyCost: null,
      }),
    }),
    {
      name: "addiction-recovery-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);