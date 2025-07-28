import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepId: string;
  stepLabel: string;
}

const codeExamples = {
  action: {
    title: "Action Dispatching Code",
    description: "This is the code that dispatches actions to trigger state changes",
    code: `// 1. Action Creators (from todo.slice.ts)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    // Action creator - creates action objects
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo = {
        id: nanoid(),
        text: action.payload,
        completed: false,
        createdAt: Date.now(),
      };
      state.todos.push(newTodo);
    },
    
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
});

// Export action creators
export const { addTodo, toggleTodo } = todoSlice.actions;

// 2. Dispatching Actions in Components
import { useAppDispatch } from '@/hooks/redux.hooks';
import { addTodo, toggleTodo } from '@/modules/Todo/store/todo.slice';

const TodoComponent = () => {
  const dispatch = useAppDispatch(); // Typed dispatch hook
  
  const handleAddTodo = (text: string) => {
    // This dispatch call triggers the Redux flow!
    dispatch(addTodo(text));
    // ↑ Creates: { type: 'todo/addTodo', payload: 'Buy groceries' }
  };
  
  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo(id));
    // ↑ Creates: { type: 'todo/toggleTodo', payload: 'todo-123' }
  };
  
  return (
    <div>
      <button onClick={() => handleAddTodo('New task')}>
        Add Todo
      </button>
    </div>
  );
};`
  },
  
  reducer: {
    title: "Reducer Processing Code",
    description: "Pure functions that calculate new state based on actions",
    code: `// Reducer Functions (from todo.slice.ts)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodoState = {
  todos: [],
  filter: 'all',
};

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    // ✅ PURE FUNCTION - No side effects, returns new state
    addTodo: (state, action: PayloadAction<string>) => {
      // Redux Toolkit uses Immer under the hood
      // This looks like mutation but creates a new state
      const newTodo: Todo = {
        id: nanoid(), // Generate unique ID
        text: action.payload,
        completed: false,
        createdAt: Date.now(),
      };
      
      // Immer handles immutability for us
      state.todos.push(newTodo);
      
      // Previous state: { todos: [] }
      // Action: { type: 'todo/addTodo', payload: 'Buy milk' }
      // New state: { todos: [{ id: '123', text: 'Buy milk', ... }] }
    },
    
    toggleTodo: (state, action: PayloadAction<string>) => {
      // Find the todo by ID
      const todo = state.todos.find(todo => todo.id === action.payload);
      
      if (todo) {
        // Toggle the completed status
        todo.completed = !todo.completed;
      }
      
      // Previous: { todos: [{ id: '123', completed: false }] }
      // Action: { type: 'todo/toggleTodo', payload: '123' }
      // New: { todos: [{ id: '123', completed: true }] }
    },
    
    deleteTodo: (state, action: PayloadAction<string>) => {
      // Filter out the todo with matching ID
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
  },
});

// How reducers work internally:
// 1. Receive current state + action
// 2. Calculate new state based on action type
// 3. Return new state object (immutably)
// 4. Never mutate original state directly`
  },
  
  store: {
    title: "Store Configuration Code",
    description: "The central hub that holds your application state",
    code: `// Store Setup (from store/index.ts)
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { reduxFlowMiddleware } from './middleware';

// 🏪 The Redux Store - Single source of truth
export const store = configureStore({
  reducer: rootReducer, // Combined reducers
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types in serialization check
        ignoredActions: ['reduxFlow/actionDispatched', 'reduxFlow/stateUpdated'],
      },
    }).concat(reduxFlowMiddleware), // Add custom middleware
});

// TypeScript types for the store
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Root Reducer (from store/rootReducer.ts)
import { combineReducers } from '@reduxjs/toolkit';
import { counterSlice } from '@/modules/Counter/store/counter.slice';
import { todoSlice } from '@/modules/Todo/store/todo.slice';
import { authSlice } from '@/modules/Auth/store/auth.slice';
import { weatherSlice } from '@/modules/Weather/store/weather.slice';
import { reduxFlowSlice } from '@/features/reduxFlow/store/reduxFlow.slice';

// 🔗 Combine all slice reducers into one root reducer
export const rootReducer = combineReducers({
  counter: counterSlice.reducer,
  todo: todoSlice.reducer,
  auth: authSlice.reducer,
  weather: weatherSlice.reducer,
  reduxFlow: reduxFlowSlice.reducer,
});

// How the store works:
// 1. Holds the complete state tree of your app
// 2. Allows state access via getState()
// 3. Allows state updates via dispatch(action)
// 4. Registers listeners via subscribe(listener)
// 5. Handles unregistering via the function returned by subscribe()

// State structure looks like:
// {
//   counter: { value: 0 },
//   todo: { todos: [], filter: 'all' },
//   auth: { user: null, isLoading: false },
//   weather: { data: null, loading: false },
//   reduxFlow: { events: [], currentEvent: null }
// }`
  },
  
  selector: {
    title: "Selector Functions Code",
    description: "Functions that extract specific data from the store",
    code: `// Basic Selectors (from todo.selectors.ts)
import { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

// 🎯 Simple selectors - extract raw data
export const selectTodos = (state: RootState) => state.todo.todos;
export const selectTodoFilter = (state: RootState) => state.todo.filter;

// 🚀 Memoized selectors - computed values with caching
export const selectFilteredTodos = createSelector(
  [selectTodos, selectTodoFilter], // Input selectors
  (todos, filter) => { // Combiner function
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
  // ✅ This result is memoized! Only recalculates when inputs change
);

export const selectTodoStats = createSelector(
  [selectTodos],
  (todos) => ({
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
  })
);

// Advanced Selectors (from reduxFlow.selectors.ts)
export const selectReduxFlowEvents = (state: RootState) => state.reduxFlow.events;
export const selectCurrentEvent = (state: RootState) => state.reduxFlow.currentEvent;

// Memoized selector with transformation
export const selectLatestEvents = createSelector(
  [selectReduxFlowEvents],
  (events) => events.slice(-10) // Get last 10 events
);

export const selectStateSlices = createSelector(
  [(state: RootState) => state],
  (state) => {
    return Object.entries(state).map(([key, value]) => ({
      name: key,
      data: value,
      size: JSON.stringify(value).length
    }));
  }
);

// How selectors work:
// 1. Take the root state as input
// 2. Extract and return specific pieces of data
// 3. Can compute derived data from state
// 4. Memoized selectors cache results for performance
// 5. Only recalculate when input values change`
  },
  
  render: {
    title: "Component Re-rendering Code",
    description: "How React components subscribe to Redux state and re-render",
    code: `// Component Subscription (from TodoModule.tsx)
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hooks';
import { selectFilteredTodos, selectTodoStats } from '../store/todo.selectors';
import { addTodo, toggleTodo, deleteTodo } from '../store/todo.slice';

const TodoModule: React.FC = () => {
  // 🔌 Subscribe to Redux state
  const filteredTodos = useAppSelector(selectFilteredTodos);
  const todoStats = useAppSelector(selectTodoStats);
  const dispatch = useAppDispatch();
  
  // ⚡ This component will re-render when:
  // - filteredTodos changes (todos array or filter changes)
  // - todoStats changes (todo count changes)
  
  const handleAddTodo = (text: string) => {
    dispatch(addTodo(text)); // Triggers state change
    // → Store updates → Selectors run → Component re-renders
  };

  return (
    <div>
      {/* This will show updated count immediately after state change */}
      <p>Total: {todoStats.total}, Active: {todoStats.active}</p>
      
      {/* This list will re-render with new todos */}
      {filteredTodos.map(todo => (
        <div key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => dispatch(toggleTodo(todo.id))}>
            Toggle
          </button>
        </div>
      ))}
      
      <button onClick={() => handleAddTodo('New task')}>
        Add Todo
      </button>
    </div>
  );
};

// Typed Redux Hooks (from hooks/redux.hooks.ts)
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

// 🎣 Typed hooks for better TypeScript support
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// How React-Redux works:
// 1. Components subscribe to store via useSelector
// 2. When state changes, React-Redux checks subscriptions
// 3. If selected data changed, component re-renders
// 4. React's virtual DOM efficiently updates only what changed
// 5. Shallow equality checks prevent unnecessary re-renders

// Performance Tips:
// ✅ Use memoized selectors for computed values
// ✅ Select only the data you need
// ✅ Use React.memo for expensive components
// ❌ Don't select the entire state object`
  }
};

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ 
  isOpen, 
  onClose, 
  stepId, 
  stepLabel 
}) => {
  const { toast } = useToast();
  const codeExample = codeExamples[stepId as keyof typeof codeExamples];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeExample.code);
    toast({ title: "Code copied to clipboard!" });
  };

  if (!codeExample) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[70vw] h-[70vh] flex flex-col p-0 bg-background border border-border shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                {codeExample.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {codeExample.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="text-xs"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 p-6">
          <ScrollArea className="h-full w-full">
            <div className="pr-4">
              <SyntaxHighlighter
                language="typescript"
                style={oneDark}
                className="!bg-transparent !m-0"
                customStyle={{
                  background: 'transparent',
                  padding: '1rem',
                  margin: 0,
                  fontSize: '0.875rem',
                  borderRadius: '0.5rem',
                  border: '1px solid hsl(var(--border))',
                }}
              >
                {codeExample.code}
              </SyntaxHighlighter>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};