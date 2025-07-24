import { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectTodos = (state: RootState) => state.todo.todos;
export const selectTodoFilter = (state: RootState) => state.todo.filter;

export const selectFilteredTodos = createSelector(
  [selectTodos, selectTodoFilter],
  (todos, filter) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);

export const selectTodoStats = createSelector(
  [selectTodos],
  (todos) => ({
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
  })
);