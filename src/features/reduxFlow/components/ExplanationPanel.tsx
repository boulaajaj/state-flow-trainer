import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { selectCurrentEvent, selectLatestEvents, selectExplanations } from '../store/reduxFlow.selectors';
import { useDispatch } from 'react-redux';
import { clearEvents } from '../store/reduxFlow.slice';

export const ExplanationPanel: React.FC = () => {
  const currentEvent = useSelector(selectCurrentEvent);
  const latestEvents = useSelector(selectLatestEvents);
  const explanations = useSelector(selectExplanations);
  const dispatch = useDispatch();

  const handleClearEvents = () => {
    dispatch(clearEvents());
  };

  return (
    <Card className="p-6 bg-card border-border h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          What's Happening?
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearEvents}
          className="text-xs"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
      
      <AnimatePresence>
        {currentEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-primary">
                {currentEvent.type.toUpperCase()}
              </Badge>
              <span className="text-sm font-medium text-primary">
                {currentEvent.actionType}
              </span>
            </div>
            
            <p className="text-sm text-foreground leading-relaxed">
              {explanations[currentEvent.type] || 'Processing...'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Recent Events
        </h4>
        
        <div className="max-h-64 overflow-y-auto space-y-2">
          {latestEvents.map((event, index) => (
            <motion.div
              key={`${event.timestamp}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-${event.type === 'action' ? 'action' : event.type === 'store' ? 'store' : 'primary'}`} />
                <span className="font-medium">{event.actionType}</span>
              </div>
              <span className="text-muted-foreground">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </div>
        
        {latestEvents.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No events yet. Start interacting with the modules!
          </p>
        )}
      </div>
    </Card>
  );
};