import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Zap,
  ChevronDown,
  ChevronUp
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
  const [isOpen, setIsOpen] = useState(false);
  
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
    <Card className="p-3 bg-card border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: isLoading ? 360 : 0 }}
                transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
              >
                <Cloud className="w-5 h-5 text-primary" />
              </motion.div>
              <h3 className="text-base font-semibold text-foreground">
                ☁️ Weather Fetcher
              </h3>
              <Badge variant="secondary" className="text-xs">
                Async Redux
              </Badge>
              {weatherData && !isOpen && (
                <Badge variant="outline" className="text-xs ml-2">
                  {lastFetchedCity} - {weatherDisplay?.temperature}
                </Badge>
              )}
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-muted-foreground group-hover:text-foreground"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-3 mt-3">
          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter city name (e.g., London, New York)"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-8 text-sm"
                disabled={isLoading}
              />
              <Button 
                onClick={handleFetchWeather}
                disabled={isLoading || !cityInput.trim()}
                size="sm"
                className="px-3"
              >
                {isLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Search className="w-3 h-3" />
                )}
              </Button>
            </div>

            {/* Quick Search Cities */}
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-muted-foreground self-center mr-2">Quick:</span>
              {quickSearchCities.map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSearch(city)}
                  disabled={isLoading}
                  className="text-xs h-6 px-2"
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
                    className="text-xs h-6"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Error
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
                className="text-xs h-6"
              >
                Clear
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                disabled={recentSearches.length === 0}
                className="text-xs h-6"
              >
                <History className="w-3 h-3 mr-1" />
                History
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
                className="p-3 bg-primary/10 border border-primary/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Cloud className="w-6 h-6 text-primary animate-pulse" />
                    <motion.div
                      className="absolute inset-0"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Cloud className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                  <div>
                    <p className="font-medium text-primary text-sm">
                      Fetching weather data...
                    </p>
                    <p className="text-xs text-muted-foreground">
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
              >
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
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
                className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="text-3xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {weatherEmoji}
                    </motion.span>
                    <div>
                      <h4 className="text-lg font-bold text-primary">
                        {weatherDisplay.temperature}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {weatherDisplay.description}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-primary text-xs">
                    {lastFetchedCity}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-3 h-3 text-primary" />
                    <span className="text-xs">
                      <span className="font-medium">Temp:</span> {weatherDisplay.temperature}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Wind className="w-3 h-3 text-primary" />
                    <span className="text-xs">
                      <span className="font-medium">Wind:</span> {weatherDisplay.windSpeed}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="text-xs">
                      <span className="font-medium">Dir:</span> {weatherDisplay.windDirection}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-primary" />
                    <span className="text-xs">
                      <span className="font-medium">Time:</span> {weatherDisplay.time}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-background/50 rounded border">
                  <p className="text-xs text-muted-foreground">
                    🎯 <strong>Redux Learning:</strong> Async thunks with{' '}
                    <span className="font-mono bg-muted px-1 rounded">createAsyncThunk</span>{' '}
                    including loading states and error handling!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
                <History className="w-3 h-3" />
                Recent Searches
              </h4>
              <ScrollArea className="h-16">
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
            <div className="text-center py-4 text-muted-foreground">
              <Cloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">
                Enter a city name to fetch real weather data and watch the Redux flow!
              </p>
              <p className="text-xs mt-1 opacity-70">
                Try: London, New York, or Tokyo
              </p>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};