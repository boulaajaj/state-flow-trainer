import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxFlowEvent } from '@/store/middleware';

interface ReduxFlowState {
  events: ReduxFlowEvent[];
  currentEvent: ReduxFlowEvent | null;
  isAnimating: boolean;
  explanations: Record<string, string>;
}

const initialState: ReduxFlowState = {
  events: [],
  currentEvent: null,
  isAnimating: false,
  explanations: {
    action: "An action was dispatched! This is a plain object describing what happened.",
    reducer: "The reducer received the action and is calculating the new state.",
    store: "The store has been updated with the new state from the reducer.",
    selector: "Selectors are extracting specific data from the updated store.",
    render: "Components are re-rendering with the new state data."
  }
};

export const reduxFlowSlice = createSlice({
  name: 'reduxFlow',
  initialState,
  reducers: {
    actionDispatched: (state, action: PayloadAction<ReduxFlowEvent>) => {
      state.events.push(action.payload);
      state.currentEvent = action.payload;
      state.isAnimating = true;
    },
    stateUpdated: (state, action: PayloadAction<ReduxFlowEvent>) => {
      state.events.push(action.payload);
      state.currentEvent = action.payload;
    },
    flowCompleted: (state) => {
      state.isAnimating = false;
      state.currentEvent = null;
    },
    clearEvents: (state) => {
      state.events = [];
      state.currentEvent = null;
      state.isAnimating = false;
    }
  }
});

export const { actionDispatched, stateUpdated, flowCompleted, clearEvents } = reduxFlowSlice.actions;