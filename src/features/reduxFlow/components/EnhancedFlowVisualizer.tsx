import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, Copy, Download, Zap, Eye, RefreshCw, HelpCircle, Activity } from 'lucide-react';
import { selectCurrentEvent, selectIsAnimating, selectLatestEvents } from '../store/reduxFlow.selectors';
import { useToast } from '@/hooks/use-toast';

const flowSteps = [
  { 
    id: 'action', 
    label: 'Action Dispatched', 
    color: 'action',
    icon: '🚀',
    description: 'An action object is created and dispatched to the store',
    learnMore: 'Actions are plain JavaScript objects that describe what happened in your app.'
  },
  { 
    id: 'reducer', 
    label: 'Reducer Processing', 
    color: 'reducer',
    icon: '⚙️',
    description: 'Pure functions that calculate the new state based on the action',
    learnMore: 'Reducers are like chefs modifying the state dish - they take ingredients (current state + action) and return a new dish (new state)!'
  },
  { 
    id: 'store', 
    label: 'Store Updated', 
    color: 'store',
    icon: '🏪',
    description: 'The Redux store holds the new state and notifies subscribers',
    learnMore: 'The store is your app\'s single source of truth - like a magical database that everyone can read from.'
  },
  { 
    id: 'selector', 
    label: 'Selectors Fired', 
    color: 'selector',
    icon: '🎯',
    description: 'Functions that extract specific pieces of data from the store',
    learnMore: 'Selectors are like smart filters that pick exactly what each component needs from the giant state object.'
  },
  { 
    id: 'render', 
    label: 'Components Re-rendered', 
    color: 'render',
    icon: '⚡',
    description: 'React components update with the new state values',
    learnMore: 'Only components that use the changed data re-render - React is smart about performance!'
  },
];

interface StepCardProps {
  step: typeof flowSteps[0];
  index: number;
  isActive: boolean;
  currentEvent: any;
  latestEvents: any[];
}

const StepCard: React.FC<StepCardProps> = ({ step, index, isActive, currentEvent, latestEvents }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const exportLogs = () => {
    const stepEvents = latestEvents.filter(event => event.type === step.id);
    const dataStr = JSON.stringify(stepEvents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${step.id}-logs.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stepEvents = latestEvents.filter(event => event.type === step.id);
  const hasEvents = stepEvents.length > 0;

  return (
    <motion.div
      className={`
        relative rounded-lg border-2 transition-all duration-300 cursor-pointer h-full
        ${isActive
          ? `border-${step.color} bg-${step.color}/10 shadow-${step.color}-glow`
          : hasEvents
          ? `border-${step.color}/50 bg-${step.color}/5 hover:border-${step.color}/70`
          : 'border-border bg-muted/30 hover:bg-muted/50'
        }
      `}
      animate={isActive ? {
        scale: [1, 1.05, 1],
        rotateY: [0, 3, 0],
      } : {}}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Pulse effect for active step */}
      {isActive && (
        <motion.div
          className={`absolute inset-0 rounded-lg border-2 border-${step.color}`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Lightning effect for render step */}
      {isActive && step.id === 'render' && (
        <motion.div
          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          <Zap className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-${step.color} fill-current`} />
        </motion.div>
      )}

      {/* Mobile active indicator - just a dot */}
      {isActive && currentEvent && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute -top-1 -right-1 w-2 h-2 bg-${step.color} rounded-full sm:hidden`}
        />
      )}

      <div className="p-2 sm:p-3 lg:p-4 h-full flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className={`
          w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-sm sm:text-lg lg:text-xl mb-2 sm:mb-3
          ${isActive
            ? `bg-${step.color} text-white`
            : hasEvents
            ? `bg-${step.color}/20 text-${step.color}`
            : 'bg-muted text-muted-foreground'
          }
        `}>
          {step.icon}
        </div>
        
        {/* Title */}
        <h4 className={`font-semibold text-center leading-tight mb-1 sm:mb-2 ${isActive ? `text-${step.color}` : 'text-foreground'}`}>
          <span className="hidden lg:block text-sm">{step.label}</span>
          <span className="hidden sm:block lg:hidden text-xs">{step.label.split(' ')[0]}</span>
          <span className="sm:hidden text-xs">{step.label.split(' ')[0]}</span>
        </h4>
        
        {/* Event count badge */}
        {hasEvents && (
          <Badge variant="outline" className="text-xs mb-2 hidden sm:block">
            {stepEvents.length}
          </Badge>
        )}

        {/* Event indicator for larger screens */}
        {isActive && currentEvent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full p-2 rounded bg-${step.color}/20 border border-${step.color}/30 hidden lg:block`}
          >
            <div className="text-xs">
              <div className="font-medium truncate">{currentEvent.actionType}</div>
              <div className="text-muted-foreground text-xs mt-1">
                {new Date(currentEvent.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        )}

        {/* Expandable details - only on large screens */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="hidden xl:block w-full mt-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-1 h-auto text-xs">
              <span className="text-muted-foreground">
                {isExpanded ? 'Hide' : 'Show'}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-2">
            <div className="space-y-2">
              {/* Latest events for this step */}
              {stepEvents.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold mb-1">Recent:</h5>
                  <ScrollArea className="h-20">
                    <div className="space-y-1">
                      {stepEvents.slice(-2).map((event, idx) => (
                        <div key={idx} className="text-xs p-2 bg-muted/50 rounded">
                          <div className="font-medium truncate">{event.actionType}</div>
                          <div className="text-muted-foreground">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(JSON.stringify(stepEvents, null, 2));
                  }}
                  className="text-xs flex-1"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    exportLogs();
                  }}
                  className="text-xs flex-1"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </motion.div>
  );
};

export const EnhancedFlowVisualizer: React.FC = () => {
  const currentEvent = useSelector(selectCurrentEvent);
  const isAnimating = useSelector(selectIsAnimating);
  const latestEvents = useSelector(selectLatestEvents);
  const [showMiniMap, setShowMiniMap] = useState(false);

  return (
    <Card className="p-2 sm:p-4 lg:p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
        <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-foreground">
          🎯 <span className="hidden sm:inline">Redux Flow Playground</span><span className="sm:hidden">Redux Flow</span>
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMiniMap(!showMiniMap)}
            className="text-xs hidden lg:flex"
          >
            <Eye className="w-3 h-3 mr-1" />
            {showMiniMap ? 'Hide' : 'Show'} Mini Map
          </Button>
        </div>
      </div>

      {/* Animated flow line */}
      <div className="relative mb-4 sm:mb-6 lg:mb-8">
        <div className="grid grid-cols-9 gap-0 items-center">
          {flowSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Card - takes 2 columns */}
              <div className="col-span-2 h-32 sm:h-36 lg:h-40">
                <StepCard
                  step={step}
                  index={index}
                  isActive={currentEvent?.type === step.id}
                  currentEvent={currentEvent}
                  latestEvents={latestEvents}
                />
              </div>
              
              {/* Flow Line - takes 1 column, except after last step */}
              {index < flowSteps.length - 1 && (
                <div className="col-span-1 flex justify-center">
                  <motion.div
                    className="w-4 sm:w-6 lg:w-8 h-1 sm:h-1.5 lg:h-2 bg-gradient-to-r from-muted via-muted to-muted relative overflow-hidden rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <AnimatePresence>
                      {isAnimating && (
                        <motion.div
                          className="absolute inset-0 bg-redux-flow-gradient rounded-full"
                          initial={{ x: '-100%', opacity: 0.7 }}
                          animate={{ x: '100%', opacity: 1 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'loop',
                            ease: 'easeInOut',
                            delay: index * 0.2
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mini Map */}
      <AnimatePresence>
        {showMiniMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-muted/30 rounded-lg border"
          >
            <h4 className="text-sm font-semibold mb-2">📍 Data Flow Mini Map</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>🎬 <span className="font-medium">User Interaction</span> → Triggers an action</p>
              <p>🚀 <span className="font-medium">Action</span> → Describes what happened</p>
              <p>⚙️ <span className="font-medium">Reducer</span> → Calculates new state</p>
              <p>🏪 <span className="font-medium">Store</span> → Saves the new state</p>
              <p>🎯 <span className="font-medium">Selectors</span> → Extract needed data</p>
              <p>⚡ <span className="font-medium">Components</span> → Re-render with new data</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};