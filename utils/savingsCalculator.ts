export const calculateSavings = (days: number, dailyCost: number | null): number => {
  if (!dailyCost) return 0;
  return Math.round(days * dailyCost);
};