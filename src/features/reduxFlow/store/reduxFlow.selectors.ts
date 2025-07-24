import { RootState } from '@/store';

export const selectReduxFlowEvents = (state: RootState) => state.reduxFlow.events;
export const selectCurrentEvent = (state: RootState) => state.reduxFlow.currentEvent;
export const selectIsAnimating = (state: RootState) => state.reduxFlow.isAnimating;
export const selectExplanations = (state: RootState) => state.reduxFlow.explanations;
export const selectLatestEvents = (state: RootState) => state.reduxFlow.events.slice(-10);