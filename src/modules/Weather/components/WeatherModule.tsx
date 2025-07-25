import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Cloud, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  MapPin, 
  Thermometer, 
  Wind, 
  Clock,
  History,
  Zap
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { 
  fetchWeather, 
  simulateWeatherError, 
  clearWeatherData, 
  clearWeatherHistory 
} from '../store/weather.slice';
import {
  selectWeatherData,
  selectWeatherStatus,
  selectWeatherError,
  selectIsLoading,
  selectHasError,
  selectWeatherDisplay,
  selectWeatherEmoji,
  selectRecentSearches,
  selectLastFetchedCity
} from '../store/weather.selectors';

export const WeatherModule: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cityInput, setCityInput] = useState('');
  
  // Selectors
  const weatherData = useAppSelector(selectWeatherData);
  const status = useAppSelector(selectWeatherStatus);
  const error = useAppSelector(selectWeatherError);
  const isLoading = useAppSelector(selectIsLoading);
  const hasError = useAppSelector(selectHasError);
  const weatherDisplay = useAppSelector(selectWeatherDisplay);
  const weatherEmoji = useAppSelector(selectWeatherEmoji);
  const recentSearches = useAppSelector(selectRecentSearches);
  const lastFetchedCity = useAppSelector(selectLastFetchedCity);

  const handleFetchWeather = async () => {
    if (cityInput.trim()) {
      dispatch(fetchWeather(cityInput.trim()));
      setCityInput('');
    }
  };

  const handleSimulateError = () => {
    dispatch(simulateWeatherError());
  };

  const handleClearData = () => {
    dispatch(clearWeatherData());
  };

  const handleClearHistory = () => {
    dispatch(clearWeatherHistory());
  };

  const handleQuickSearch = (city: string) => {
    dispatch(fetchWeather(city));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetchWeather();
    }
  };

  // Quick search cities for demo
  const quickSearchCities = ['London', 'New York', 'Tokyo', 'Sydney', 'Paris'];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ rotate: isLoading ? 360 : 0 }}
          transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
        >
          <Cloud className="w-6 h-6 text-primary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-foreground">
          ☁️ Weather Fetcher
        </h3>
        <Badge variant="secondary" className="text-xs">
          Async Redux
        </Badge>
      </div>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Enter city name (e.g., London, New York)"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleFetchWeather}
            disabled={isLoading || !cityInput.trim()}
            className="px-4"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Quick Search Cities */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Quick search:</span>
          {quickSearchCities.map((city) => (
            <Button
              key={city}
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch(city)}
              disabled={isLoading}
              className="text-xs"
            >
              {city}
            </Button>
          ))}
        </div>

        {/* Demo Controls */}
        <div className="flex gap-2 pt-2 border-t">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSimulateError}
                disabled={isLoading}
                className="text-xs"
              >
                <Zap className="w-3 h-3 mr-1" />
                Simulate Error
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Test error handling in Redux thunks</p>
            </TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearData}
            disabled={isLoading || !weatherData}
            className="text-xs"
          >
            Clear Data
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            disabled={recentSearches.length === 0}
            className="text-xs"
          >
            <History className="w-3 h-3 mr-1" />
            Clear History
          </Button>
        </div>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Cloud className="w-8 h-8 text-primary animate-pulse" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Cloud className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
              <div>
                <p className="font-medium text-primary">
                  Fetching weather data...
                </p>
                <p className="text-sm text-muted-foreground">
                  {lastFetchedCity && `Looking up "${lastFetchedCity}"`}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {hasError && error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mb-4"
          >
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Weather Error:</strong> {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Display */}
      <AnimatePresence>
        {weatherDisplay && status === 'succeeded' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-4xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {weatherEmoji}
                </motion.span>
                <div>
                  <h4 className="text-xl font-bold text-primary">
                    {weatherDisplay.temperature}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {weatherDisplay.description}
                  </p>
                </div>
              </div>
              <Badge className="bg-primary">
                {lastFetchedCity}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <span className="font-medium">Temperature:</span> {weatherDisplay.temperature}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <span className="font-medium">Wind:</span> {weatherDisplay.windSpeed}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <span className="font-medium">Direction:</span> {weatherDisplay.windDirection}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <span className="font-medium">Time:</span> {weatherDisplay.time}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-background/50 rounded border">
              <p className="text-xs text-muted-foreground">
                🎯 <strong>Redux Learning:</strong> This demonstrates async thunks with{' '}
                <span className="font-mono bg-muted px-1 rounded">createAsyncThunk</span>{' '}
                including loading states, error handling, and data transformation!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent Searches
          </h4>
          <ScrollArea className="h-24">
            <div className="space-y-1">
              {recentSearches.map((search, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs cursor-pointer hover:bg-muted/50"
                  onClick={() => handleQuickSearch(search.city)}
                >
                  <span className="font-medium">{search.city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{search.temperature}°C</span>
                    <span className="text-muted-foreground">{search.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Help Text */}
      {!weatherData && !isLoading && !hasError && (
        <div className="text-center py-8 text-muted-foreground">
          <Cloud className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            Enter a city name to fetch real weather data and watch the Redux flow!
          </p>
          <p className="text-xs mt-1">
            Try: London, New York, or Tokyo
          </p>
        </div>
      )}
    </Card>
  );
};