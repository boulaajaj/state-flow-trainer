import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
  description?: string;
}

export interface WeatherState {
  data: WeatherData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedCity: string | null;
  history: Array<{ city: string; data: WeatherData; timestamp: number }>;
}

const initialState: WeatherState = {
  data: null,
  status: 'idle',
  error: null,
  lastFetchedCity: null,
  history: [],
};

// Geocoding helper function to get coordinates from city name
const getCoordinates = async (city: string) => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );
  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found`);
  }
  
  return {
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
    name: data.results[0].name,
    country: data.results[0].country
  };
};

// Async thunk for fetching weather data
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city: string, { rejectWithValue }) => {
    try {
      // First, get coordinates for the city
      const coordinates = await getCoordinates(city);
      
      // Then fetch weather data using coordinates
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current_weather=true&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error('Weather service unavailable');
      }
      
      const data = await response.json();
      
      return {
        weatherData: data.current_weather,
        cityInfo: coordinates,
        city: city
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch weather');
    }
  }
);

// Simulate error for learning purposes
export const simulateWeatherError = createAsyncThunk(
  'weather/simulateError',
  async (_, { rejectWithValue }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return rejectWithValue('Simulated API error for learning purposes!');
  }
);

// Weather code descriptions
const getWeatherDescription = (code: number): string => {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail'
  };
  
  return weatherCodes[code] || 'Unknown weather condition';
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearWeatherData: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
      state.lastFetchedCity = null;
    },
    clearWeatherHistory: (state) => {
      state.history = [];
    },
    addToHistory: (state, action: PayloadAction<{ city: string; data: WeatherData }>) => {
      state.history.unshift({
        ...action.payload,
        timestamp: Date.now()
      });
      // Keep only last 5 searches
      state.history = state.history.slice(0, 5);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch weather cases
      .addCase(fetchWeather.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.lastFetchedCity = action.meta.arg;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = {
          ...action.payload.weatherData,
          description: getWeatherDescription(action.payload.weatherData.weathercode)
        };
        state.error = null;
        
        // Add to history
        state.history.unshift({
          city: action.payload.city,
          data: state.data,
          timestamp: Date.now()
        });
        state.history = state.history.slice(0, 5);
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch weather data';
        state.data = null;
      })
      // Simulate error cases
      .addCase(simulateWeatherError.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.lastFetchedCity = 'Simulation';
      })
      .addCase(simulateWeatherError.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Simulated error';
        state.data = null;
      });
  },
});

export const { clearWeatherData, clearWeatherHistory, addToHistory } = weatherSlice.actions;
export default weatherSlice;
