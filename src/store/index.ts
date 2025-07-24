import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { reduxFlowMiddleware } from './middleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['reduxFlow/actionDispatched', 'reduxFlow/stateUpdated'],
      },
    }).concat(reduxFlowMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;