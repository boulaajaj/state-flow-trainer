import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const selectReduxFlowEvents = (state: RootState) => state.reduxFlow.events;
export const selectCurrentEvent = (state: RootState) => state.reduxFlow.currentEvent;
export const selectIsAnimating = (state: RootState) => state.reduxFlow.isAnimating;
export const selectExplanations = (state: RootState) => state.reduxFlow.explanations;

// Memoized selector to prevent unnecessary rerenders
export const selectLatestEvents = createSelector(
  [selectReduxFlowEvents],
  (events) => events.slice(-10)
);

// Selectors for StateInspector
export const selectRootState = (state: RootState) => state;
export const selectStateSlices = createSelector(
  [selectRootState],
  (state) => {
    return Object.entries(state).map(([key, value]) => ({
      name: key,
      data: value,
      size: JSON.stringify(value).length
    }));
  }
);