import { combineReducers } from '@reduxjs/toolkit';
import { counterSlice } from '@/modules/Counter/store/counter.slice';
import { todoSlice } from '@/modules/Todo/store/todo.slice';
import { authSlice } from '@/modules/Auth/store/auth.slice';
import { reduxFlowSlice } from '@/features/reduxFlow/store/reduxFlow.slice';
import weatherSlice from '@/modules/Weather/store/weather.slice';

export const rootReducer = combineReducers({
  counter: counterSlice.reducer,
  todo: todoSlice.reducer,
  auth: authSlice.reducer,
  reduxFlow: reduxFlowSlice.reducer,
  weather: weatherSlice.reducer,
});