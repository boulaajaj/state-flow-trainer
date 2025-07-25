import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

// Base selectors
export const selectWeatherState = (state: RootState) => state.weather;
export const selectWeatherData = (state: RootState) => state.weather.data;
export const selectWeatherStatus = (state: RootState) => state.weather.status;
export const selectWeatherError = (state: RootState) => state.weather.error;
export const selectLastFetchedCity = (state: RootState) => state.weather.lastFetchedCity;
export const selectWeatherHistory = (state: RootState) => state.weather.history;

// Computed selectors
export const selectIsLoading = createSelector(
  [selectWeatherStatus],
  (status) => status === 'loading'
);

export const selectHasError = createSelector(
  [selectWeatherStatus],
  (status) => status === 'failed'
);

export const selectHasWeatherData = createSelector(
  [selectWeatherData],
  (data) => data !== null
);

export const selectWeatherDisplay = createSelector(
  [selectWeatherData],
  (data) => {
    if (!data) return null;
    
    return {
      temperature: `${Math.round(data.temperature)}°C`,
      description: data.description || 'Unknown',
      windSpeed: `${data.windspeed} km/h`,
      windDirection: `${data.winddirection}°`,
      isDay: data.is_day === 1,
      time: new Date(data.time).toLocaleString()
    };
  }
);

export const selectRecentSearches = createSelector(
  [selectWeatherHistory],
  (history) => history.slice(0, 3).map(item => ({
    city: item.city,
    temperature: Math.round(item.data.temperature),
    timestamp: new Date(item.timestamp).toLocaleTimeString()
  }))
);

// Weather emoji selector
export const selectWeatherEmoji = createSelector(
  [selectWeatherData],
  (data) => {
    if (!data) return '❓';
    
    const { weathercode, is_day } = data;
    
    // Weather code to emoji mapping
    if (weathercode === 0) return is_day ? '☀️' : '🌙';
    if (weathercode <= 3) return is_day ? '⛅' : '🌙';
    if (weathercode <= 48) return '🌫️';
    if (weathercode <= 65) return '🌧️';
    if (weathercode <= 75) return '❄️';
    if (weathercode <= 82) return '🌦️';
    if (weathercode >= 95) return '⛈️';
    
    return '🌤️';
  }
);