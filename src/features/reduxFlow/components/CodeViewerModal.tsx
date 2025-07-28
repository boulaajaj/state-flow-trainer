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
  currentEvent?: any; // The current Redux event to get dynamic code from
}

// Helper function to determine module from action type
const getModuleFromActionType = (actionType: string) => {
  if (actionType.startsWith('counter/')) return 'counter';
  if (actionType.startsWith('todo/')) return 'todo';
  if (actionType.startsWith('auth/')) return 'auth';
  if (actionType.startsWith('weather/')) return 'weather';
  return 'general';
};

// Dynamic code examples based on the current event
const getDynamicCodeExample = (stepId: string, currentEvent: any) => {
  // Try different possible action type locations
  const actionType = currentEvent?.action?.type || currentEvent?.actionType || currentEvent?.type || '';
  const payload = currentEvent?.action?.payload || currentEvent?.payload;
  const module = getModuleFromActionType(actionType);
  
  console.log('getDynamicCodeExample Debug:', {
    actionType,
    payload,
    module,
    currentEvent
  });
  
  const moduleConfigs = {
    counter: {
      sliceName: 'counter',
      modulePath: 'Counter',
      sampleActions: ['increment', 'decrement', 'reset', 'setStep', 'incrementByAmount'],
      interface: `interface CounterState {
  value: number;
  step: number;
}`,
      selector: 'selectCounterValue, selectCounterStep',
      initialState: `const initialState: CounterState = {
  value: 0,
  step: 1,
};`
    },
    todo: {
      sliceName: 'todo',
      modulePath: 'Todo',
      sampleActions: ['addTodo', 'toggleTodo', 'deleteTodo', 'editTodo', 'setFilter'],
      interface: `interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}`,
      selector: 'selectTodos, selectFilteredTodos, selectTodoStats',
      initialState: `const initialState: TodoState = {
  todos: [],
  filter: 'all',
};`
    },
    auth: {
      sliceName: 'auth',
      modulePath: 'Auth',
      sampleActions: ['loginStart', 'loginSuccess', 'loginFailure', 'logout', 'updateProfile'],
      interface: `interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}`,
      selector: 'selectCurrentUser, selectIsAuthenticated, selectAuthError',
      initialState: `const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};`
    },
    weather: {
      sliceName: 'weather',
      modulePath: 'Weather',
      sampleActions: ['fetchWeather', 'clearWeatherData', 'simulateWeatherError'],
      interface: `interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
}

interface WeatherState {
  data: WeatherData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedCity: string | null;
}`,
      selector: 'selectWeatherData, selectWeatherStatus, selectWeatherError',
      initialState: `const initialState: WeatherState = {
  data: null,
  status: 'idle',
  error: null,
  lastFetchedCity: null,
};`
    }
  };

  const config = moduleConfigs[module as keyof typeof moduleConfigs];
  if (!config) {
    console.error('No config found for module:', module, 'Available modules:', Object.keys(moduleConfigs));
    return null;
  }
  
  const currentActionName = actionType.split('/')[1] || 'sampleAction';

  const codeExamples = {
    action: {
      title: `Action Dispatching Code - ${config.modulePath} Module`,
      description: `Code for dispatching the "${actionType}" action that was just triggered`,
      code: `// 1. Action Creators (from ${config.modulePath.toLowerCase()}.slice.ts)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

${config.interface}

${config.initialState}

export const ${config.sliceName}Slice = createSlice({
  name: '${config.sliceName}',
  initialState,
  reducers: {
    // ✨ THE ACTION THAT JUST FIRED: ${actionType}
    ${currentActionName}: (state, action) => {
      // This is the reducer that just processed your action!
      ${module === 'counter' && currentActionName === 'increment' ? 
        `state.value += state.step; // Increment by step amount` :
      module === 'counter' && currentActionName === 'decrement' ? 
        `state.value -= state.step; // Decrement by step amount` :
      module === 'todo' && currentActionName === 'addTodo' ? 
        `const newTodo = {
        id: nanoid(),
        text: action.payload,
        completed: false,
        createdAt: Date.now(),
      };
      state.todos.push(newTodo);` :
      module === 'todo' && currentActionName === 'toggleTodo' ? 
        `const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }` :
      module === 'auth' && currentActionName === 'loginSuccess' ? 
        `state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;` :
      `// Process action payload: ${JSON.stringify(payload, null, 6)}`}
    },
    
    // Other actions in this slice
    ${config.sampleActions.filter(a => a !== currentActionName).slice(0, 2).map(action => `${action}: (state, action) => {
      // ${action} implementation
    }`).join(',\n    ')}
  },
});

// Export action creators
export const { ${config.sampleActions.join(', ')} } = ${config.sliceName}Slice.actions;

// 2. Dispatching Actions in Components
import { useAppDispatch } from '@/hooks/redux.hooks';
import { ${currentActionName} } from '@/modules/${config.modulePath}/store/${config.sliceName}.slice';

const ${config.modulePath}Component = () => {
  const dispatch = useAppDispatch(); // Typed dispatch hook
  
  const handle${currentActionName.charAt(0).toUpperCase() + currentActionName.slice(1)} = ${payload !== undefined ? `(${typeof payload === 'string' ? 'text: string' : 'payload: any'}) => {` : '() => {'}
    // 🚀 THIS DISPATCH CALL JUST HAPPENED!
    dispatch(${currentActionName}(${payload !== undefined ? (typeof payload === 'string' ? 'text' : 'payload') : ''}));
    // ↑ Created: { type: '${actionType}', payload: ${JSON.stringify(payload)} }
  };
  
  return (
    <button onClick={handle${currentActionName.charAt(0).toUpperCase() + currentActionName.slice(1)}}>
      ${currentActionName.charAt(0).toUpperCase() + currentActionName.slice(1)}
    </button>
  );
};

// 📝 Action that just fired:
// Type: "${actionType}"
// Payload: ${JSON.stringify(payload, null, 2) || 'undefined'}
// Timestamp: ${currentEvent?.timestamp ? new Date(currentEvent.timestamp).toLocaleTimeString() : 'N/A'}`
    },
    
    reducer: {
      title: `Reducer Processing - ${config.modulePath} Module`,
      description: `The reducer that just processed the "${actionType}" action`,
      code: `// Reducer Function (from ${config.modulePath.toLowerCase()}.slice.ts)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

${config.interface}

${config.initialState}

export const ${config.sliceName}Slice = createSlice({
  name: '${config.sliceName}',
  initialState,
  reducers: {
    // ⚡ THIS REDUCER JUST RAN for action: ${actionType}
    ${currentActionName}: (state, action) => {
      // ✅ PURE FUNCTION - No side effects, immutable state updates
      ${module === 'counter' && currentActionName === 'increment' ? 
        `// Previous state: { value: ${(currentEvent?.previousState?.counter?.value || 0)}, step: ${(currentEvent?.previousState?.counter?.step || 1)} }
      state.value += state.step;
      // New state: { value: ${(currentEvent?.newState?.counter?.value || 'X')}, step: ${(currentEvent?.newState?.counter?.step || 1)} }` :
      module === 'counter' && currentActionName === 'decrement' ? 
        `// Previous state: { value: ${(currentEvent?.previousState?.counter?.value || 0)}, step: ${(currentEvent?.previousState?.counter?.step || 1)} }
      state.value -= state.step;
      // New state: { value: ${(currentEvent?.newState?.counter?.value || 'X')}, step: ${(currentEvent?.newState?.counter?.step || 1)} }` :
      module === 'todo' && currentActionName === 'addTodo' ? 
        `// Redux Toolkit uses Immer - looks like mutation but creates new state
      const newTodo = {
        id: nanoid(),
        text: action.payload, // "${payload}"
        completed: false,
        createdAt: Date.now(),
      };
      state.todos.push(newTodo);
      
      // Previous state: { todos: [${(currentEvent?.previousState?.todo?.todos?.length || 0)} items] }
      // New state: { todos: [${(currentEvent?.newState?.todo?.todos?.length || 'X')} items] }` :
      module === 'todo' && currentActionName === 'toggleTodo' ? 
        `const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
      // Toggled todo with ID: "${payload}"` :
      module === 'auth' && currentActionName === 'loginSuccess' ? 
        `state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      
      // User logged in: ${payload?.name || 'Unknown user'}` :
      `// Processed action payload: ${JSON.stringify(payload, null, 8)}
      // State update logic here...`}
    },
    
    // Other reducers in this slice
    ${config.sampleActions.filter(a => a !== currentActionName).slice(0, 2).map(action => `${action}: (state, action) => {
      // ${action} reducer logic
    }`).join(',\n    ')}
  },
});

// 🔄 How this reducer just worked:
// 1. Received action: { type: "${actionType}", payload: ${JSON.stringify(payload)} }
// 2. Applied state changes immutably using Immer
// 3. Returned new state to the store
// 4. Store notified all subscribers of the change

// 📊 State before/after:
// Before: ${JSON.stringify(currentEvent?.previousState?.[module] || {}, null, 2)}
// After:  ${JSON.stringify(currentEvent?.newState?.[module] || {}, null, 2)}`
    },
    
    store: {
      title: "Store Configuration Code",
      description: "The Redux store that just processed your action",
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
        ignoredActions: ['reduxFlow/actionDispatched', 'reduxFlow/stateUpdated'],
      },
    }).concat(reduxFlowMiddleware), // Tracks the flow you're seeing!
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

// 🔗 Combined reducer that just processed your action
export const rootReducer = combineReducers({
  counter: counterSlice.reducer,    // ← ${module === 'counter' ? '✅ JUST UPDATED!' : 'Not involved'}
  todo: todoSlice.reducer,          // ← ${module === 'todo' ? '✅ JUST UPDATED!' : 'Not involved'}
  auth: authSlice.reducer,          // ← ${module === 'auth' ? '✅ JUST UPDATED!' : 'Not involved'}
  weather: weatherSlice.reducer,    // ← ${module === 'weather' ? '✅ JUST UPDATED!' : 'Not involved'}
  reduxFlow: reduxFlowSlice.reducer,// ← Always tracking
});

// 🚀 What just happened in the store:
// 1. Action dispatched: ${actionType}
// 2. Middleware intercepted and logged it
// 3. Root reducer delegated to ${module}Slice.reducer
// 4. ${module.charAt(0).toUpperCase() + module.slice(1)} state updated
// 5. All subscribers notified
// 6. Components re-rendered if their selected data changed

// 📊 Current complete state structure:
${JSON.stringify(currentEvent?.newState || {}, null, 2)}`
    },
    
    selector: {
      title: `Selector Functions - ${config.modulePath} Module`,
      description: `Selectors that extract data from the ${module} state`,
      code: `// Selectors (from ${config.modulePath.toLowerCase()}.selectors.ts)
import { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

// 🎯 Basic selectors - extract raw data from ${module} state
${module === 'counter' ? `export const selectCounterValue = (state: RootState) => state.counter.value;
export const selectCounterStep = (state: RootState) => state.counter.step;

// 🚀 Memoized selectors - computed values with caching
export const selectCounterDisplay = createSelector(
  [selectCounterValue],
  (value) => \`Current count: \${value}\`
);` :
module === 'todo' ? `export const selectTodos = (state: RootState) => state.todo.todos;
export const selectTodoFilter = (state: RootState) => state.todo.filter;

// 🚀 Memoized selectors - computed values with caching
export const selectFilteredTodos = createSelector(
  [selectTodos, selectTodoFilter],
  (todos, filter) => {
    switch (filter) {
      case 'active': return todos.filter(todo => !todo.completed);
      case 'completed': return todos.filter(todo => todo.completed);
      default: return todos;
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
);` :
module === 'auth' ? `export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthError = (state: RootState) => state.auth.error;

// 🚀 Memoized selectors
export const selectUserDisplayName = createSelector(
  [selectCurrentUser],
  (user) => user ? \`\${user.name} (\${user.role})\` : 'Not logged in'
);` :
`export const selectWeatherData = (state: RootState) => state.weather.data;
export const selectWeatherStatus = (state: RootState) => state.weather.status;
export const selectWeatherError = (state: RootState) => state.weather.error;

// 🚀 Memoized selectors
export const selectTemperatureDisplay = createSelector(
  [selectWeatherData],
  (data) => data ? \`\${data.temperature}°C\` : 'No data'
);`}

// ⚡ SELECTOR USAGE IN COMPONENTS
import { useAppSelector } from '@/hooks/redux.hooks';
import { ${config.selector} } from '@/modules/${config.modulePath}/store/${config.sliceName}.selectors';

const ${config.modulePath}Component = () => {
  // 🔌 These selectors will get the updated state after the action
  const data = useAppSelector(select${config.modulePath}${module === 'counter' ? 'Value' : module === 'todo' ? 's' : module === 'auth' ? 'User' : 'Data'});
  
  // ⚡ This component re-renders when selected data changes
  // After the "${actionType}" action, these selectors returned new values
  
  return <div>{/* Component renders with new data */}</div>;
};

// 🔍 What just happened with selectors:
// 1. Action "${actionType}" updated ${module} state
// 2. Components subscribed to ${module} selectors got notified
// 3. Selectors re-ran and returned new values: 
//    ${JSON.stringify(currentEvent?.newState?.[module] || {}, null, 4)}
// 4. Components re-rendered with fresh data

// 💡 Selector performance:
// ✅ Memoized selectors only recalculate when input data changes
// ✅ Shallow equality prevents unnecessary re-renders
// ⚡ Your "${actionType}" action triggered exactly the right updates!`
    },
    
    render: {
      title: `Component Re-rendering - ${config.modulePath} Module`,
      description: `How components respond to the "${actionType}" action`,
      code: `// Component Subscription (from ${config.modulePath}Module.tsx)
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hooks';
import { ${config.selector} } from '../store/${config.sliceName}.selectors';
import { ${config.sampleActions.slice(0, 3).join(', ')} } from '../store/${config.sliceName}.slice';

const ${config.modulePath}Module: React.FC = () => {
  // 🔌 Subscribe to Redux state - these selectors just re-ran!
  ${module === 'counter' ? `const counterValue = useAppSelector(selectCounterValue);
  const counterStep = useAppSelector(selectCounterStep);` :
  module === 'todo' ? `const todos = useAppSelector(selectTodos);
  const filteredTodos = useAppSelector(selectFilteredTodos);
  const todoStats = useAppSelector(selectTodoStats);` :
  module === 'auth' ? `const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authError = useAppSelector(selectAuthError);` :
  `const weatherData = useAppSelector(selectWeatherData);
  const weatherStatus = useAppSelector(selectWeatherStatus);`}
  
  const dispatch = useAppDispatch();
  
  // ⚡ THIS COMPONENT JUST RE-RENDERED because:
  // - Action "${actionType}" was dispatched
  // - ${config.modulePath} state changed
  // - Subscribed selectors returned new values
  // - React-Redux triggered a re-render
  
  ${module === 'counter' ? `// Current values after the action:
  // Value: ${currentEvent?.newState?.counter?.value || 'X'} (was ${currentEvent?.previousState?.counter?.value || 0})
  // Step: ${currentEvent?.newState?.counter?.step || 1}` :
  module === 'todo' ? `// Current state after the action:
  // Total todos: ${currentEvent?.newState?.todo?.todos?.length || 'X'}
  // Filter: ${currentEvent?.newState?.todo?.filter || 'all'}` :
  module === 'auth' ? `// Current auth state:
  // User: ${currentEvent?.newState?.auth?.user?.name || 'Not logged in'}
  // Authenticated: ${currentEvent?.newState?.auth?.isAuthenticated || false}` :
  `// Current weather state:
  // Status: ${currentEvent?.newState?.weather?.status || 'idle'}
  // Data: ${currentEvent?.newState?.weather?.data ? 'Available' : 'None'}`}

  const handle${currentActionName.charAt(0).toUpperCase() + currentActionName.slice(1)} = () => {
    dispatch(${currentActionName}(${payload !== undefined ? JSON.stringify(payload) : ''}));
  };

  return (
    <div>
      {/* 🎨 This UI reflects the state changes from "${actionType}" */}
      ${module === 'counter' ? `<div>Count: {counterValue}</div>
      <div>Step: {counterStep}</div>
      <button onClick={() => dispatch(increment())}>+</button>` :
      module === 'todo' ? `<div>Total: {todoStats.total}, Active: {todoStats.active}</div>
      {filteredTodos.map(todo => (
        <div key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => dispatch(toggleTodo(todo.id))}>Toggle</button>
        </div>
      ))}` :
      module === 'auth' ? `{isAuthenticated ? (
        <div>Welcome, {currentUser?.name}!</div>
      ) : (
        <div>Please log in</div>
      )}` :
      `{weatherData ? (
        <div>Temperature: {weatherData.temperature}°C</div>
      ) : (
        <div>No weather data</div>
      )}`}
    </div>
  );
};

// 🔄 React-Redux Re-render Cycle (what just happened):
// 1. Action "${actionType}" dispatched at ${currentEvent?.timestamp ? new Date(currentEvent.timestamp).toLocaleTimeString() : 'N/A'}
// 2. Store state updated: ${module} slice changed
// 3. React-Redux checked all subscriptions
// 4. Components using ${module} selectors got notified
// 5. Those components re-rendered with new data
// 6. Virtual DOM diffed and updated only changed elements

// 📊 Performance impact:
// ✅ Only components subscribed to changed data re-rendered
// ✅ Memoized selectors prevented unnecessary calculations
// ✅ React's reconciliation minimized DOM updates
// 🎯 Your action had precisely the right impact!

// 💡 To see this in action, check your React DevTools:
// - Components tab shows which components re-rendered
// - Profiler shows timing information
// - Redux DevTools shows the exact state changes`
    }
  };

  return codeExamples[stepId as keyof typeof codeExamples] || null;
};

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ 
  isOpen, 
  onClose, 
  stepId, 
  stepLabel,
  currentEvent
}) => {
  const { toast } = useToast();
  
  // Debug logging
  console.log('CodeViewerModal Debug:', {
    stepId,
    currentEvent,
    actionType: currentEvent?.action?.type,
    actionTypeAlt: currentEvent?.actionType,
    payload: currentEvent?.action?.payload || currentEvent?.payload
  });
  
  const codeExample = getDynamicCodeExample(stepId, currentEvent);

  const copyToClipboard = () => {
    if (codeExample) {
      navigator.clipboard.writeText(codeExample.code);
      toast({ title: "Code copied to clipboard!" });
    }
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