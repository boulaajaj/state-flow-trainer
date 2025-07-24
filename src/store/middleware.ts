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
  
  // Step 1: Action dispatched
  store.dispatch(reduxFlowSlice.actions.actionDispatched({
    type: 'action',
    actionType: action.type,
    timestamp: Date.now(),
    payload: action.payload,
  }));

  // Step 2: Reducer processing (simulate delay)
  setTimeout(() => {
    store.dispatch(reduxFlowSlice.actions.actionDispatched({
      type: 'reducer',
      actionType: action.type,
      timestamp: Date.now(),
      payload: action.payload,
    }));
  }, 300);

  const result = next(action);
  
  const stateAfter = store.getState();
  
  // Step 3: Store updated
  if (stateBefore !== stateAfter) {
    setTimeout(() => {
      store.dispatch(reduxFlowSlice.actions.stateUpdated({
        type: 'store',
        actionType: action.type,
        timestamp: Date.now(),
        stateBefore,
        stateAfter,
      }));
      
      // Step 4: Selectors fired
      setTimeout(() => {
        store.dispatch(reduxFlowSlice.actions.actionDispatched({
          type: 'selector',
          actionType: action.type,
          timestamp: Date.now(),
        }));
        
        // Step 5: Components re-rendered
        setTimeout(() => {
          store.dispatch(reduxFlowSlice.actions.actionDispatched({
            type: 'render',
            actionType: action.type,
            timestamp: Date.now(),
          }));
          
          // Complete the flow
          setTimeout(() => {
            store.dispatch(reduxFlowSlice.actions.flowCompleted());
          }, 500);
        }, 200);
      }, 200);
    }, 600);
  }

  return result;
};