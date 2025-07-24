import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { reduxFlowSlice } from '@/features/reduxFlow/store/reduxFlow.slice';

export interface ReduxFlowEvent {
  type: 'action' | 'reducer' | 'store' | 'selector' | 'render';
  actionType: string;
  timestamp: number;
  payload?: any;
  stateBefore?: any;
  stateAfter?: any;
}

export const reduxFlowMiddleware: Middleware = (store) => (next) => (action: AnyAction) => {
  // Skip redux flow actions to avoid infinite loops
  if (action.type?.startsWith('reduxFlow/')) {
    return next(action);
  }

  const stateBefore = store.getState();
  
  // Dispatch action flow event
  store.dispatch(reduxFlowSlice.actions.actionDispatched({
    type: 'action',
    actionType: action.type,
    timestamp: Date.now(),
    payload: action.payload,
  }));

  const result = next(action);
  
  const stateAfter = store.getState();
  
  // Dispatch state update flow event
  if (stateBefore !== stateAfter) {
    store.dispatch(reduxFlowSlice.actions.stateUpdated({
      type: 'store',
      actionType: action.type,
      timestamp: Date.now(),
      stateBefore,
      stateAfter,
    }));
  }

  return result;
};