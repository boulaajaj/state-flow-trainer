import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Play, Pause } from 'lucide-react';
import { selectReduxFlowEvents } from '../store/reduxFlow.selectors';
import { useDispatch } from 'react-redux';
import { clearEvents } from '../store/reduxFlow.slice';

export const ActionLogger: React.FC = () => {
  const events = useSelector(selectReduxFlowEvents);
  const dispatch = useDispatch();
  const [isPaused, setIsPaused] = React.useState(false);
  const [displayEvents, setDisplayEvents] = React.useState(events);

  React.useEffect(() => {
    if (!isPaused) {
      // Show newest events first (reverse chronological order)
      setDisplayEvents([...events].reverse());
    }
  }, [events, isPaused]);

  const handleClearEvents = () => {
    dispatch(clearEvents());
    setDisplayEvents([]);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'action': return 'bg-action/20 text-action border-action/30';
      case 'store': return 'bg-store/20 text-store border-store/30';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <Card className="p-4 bg-card border-border h-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Action Logger
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs"
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearEvents}
            className="text-xs"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-64">
        <div className="space-y-2">
          <AnimatePresence>
            {displayEvents.slice(0, 20).map((event, index) => (
              <motion.div
                key={`${event.timestamp}-${index}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`p-2 rounded-lg border text-xs ${getEventColor(event.type)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {event.type.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{event.actionType}</span>
                  </div>
                  <span className="text-xs opacity-70">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {event.payload && (
                  <div className="mt-1 text-xs opacity-80">
                    <code className="bg-background/50 px-1 py-0.5 rounded">
                      {JSON.stringify(event.payload)}
                    </code>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {displayEvents.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              No actions logged yet. Start interacting with the modules!
            </p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};