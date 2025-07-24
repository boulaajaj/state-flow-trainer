import { RootState } from '@/store';

export const selectCounterValue = (state: RootState) => state.counter.value;
export const selectCounterStep = (state: RootState) => state.counter.step;
export const selectCounterState = (state: RootState) => state.counter;