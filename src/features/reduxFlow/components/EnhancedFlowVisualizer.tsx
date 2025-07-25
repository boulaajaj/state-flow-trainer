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
    shortLabel: 'Action',
    mobileLabel: 'Act',
    color: 'action',
    icon: '🚀',
    description: 'An action object is created and dispatched to the store',
    learnMore: 'Actions are plain JavaScript objects that describe what happened in your app.'
  },
  { 
    id: 'reducer', 
    label: 'Reducer Processing',
    shortLabel: 'Reducer',
    mobileLabel: 'Red',
    color: 'reducer',
    icon: '⚙️',
    description: 'Pure functions that calculate the new state based on the action',
    learnMore: 'Reducers are like chefs modifying the state dish - they take ingredients (current state + action) and return a new dish (new state)!'
  },
  { 
    id: 'store', 
    label: 'Store Updated',
    shortLabel: 'Store',
    mobileLabel: 'Str',
    color: 'store',
    icon: '🏪',
    description: 'The Redux store holds the new state and notifies subscribers',
    learnMore: 'The store is your app\'s single source of truth - like a magical database that everyone can read from.'
  },
  { 
    id: 'selector', 
    label: 'Selectors Fired',
    shortLabel: 'Selectors',
    mobileLabel: 'Sel',
    color: 'selector',
    icon: '🎯',
    description: 'Functions that extract specific pieces of data from the store',
    learnMore: 'Selectors are like smart filters that pick exactly what each component needs from the giant state object.'
  },
  { 
    id: 'render', 
    label: 'Components Re-rendered',
    shortLabel: 'Re-render',
    mobileLabel: 'Ren',
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

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-0.5 sm:p-1 md:p-2 lg:p-3 h-full flex flex-col items-center justify-center text-center cursor-pointer">
            {/* Icon */}
            <div className={`
              w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full flex items-center justify-center text-2xs sm:text-xs md:text-sm lg:text-base xl:text-lg mb-0.5 sm:mb-1 lg:mb-2 flex-shrink-0
              ${isActive
                ? `bg-${step.color} text-white`
                : hasEvents
                ? `bg-${step.color}/20 text-${step.color}`
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {step.icon}
            </div>
            
            {/* Title - responsive with proper labels */}
            <h4 className={`font-medium text-center leading-tight flex-shrink-0 ${isActive ? `text-${step.color}` : 'text-foreground'}`}>
              <span className="hidden xl:block text-sm whitespace-nowrap">{step.label}</span>
              <span className="hidden lg:block xl:hidden text-xs whitespace-nowrap">{step.shortLabel}</span>
              <span className="hidden md:block lg:hidden text-xs whitespace-nowrap">{step.shortLabel}</span>
              <span className="hidden sm:block md:hidden text-xs whitespace-nowrap">{step.mobileLabel}</span>
              <span className="sm:hidden text-xs whitespace-nowrap">{step.mobileLabel}</span>
            </h4>
            
            {/* Event count badge - only on larger screens */}
            {hasEvents && (
              <Badge variant="outline" className="text-3xs h-3 px-0.5 mt-0.5 hidden lg:block flex-shrink-0">
                {stepEvents.length}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{step.label}</p>
          <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
        </TooltipContent>
      </Tooltip>

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
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="hidden xl:block w-full">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-1 h-auto text-xs mt-1">
            <span className="text-muted-foreground">
              {isExpanded ? 'Hide' : 'Show'}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2">
          <div className="bg-card border border-border rounded-lg shadow-lg p-3 space-y-2">
            {/* Latest events for this step */}
            {stepEvents.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold mb-1 text-foreground">Recent:</h5>
                <ScrollArea className="h-20">
                  <div className="space-y-1">
                    {stepEvents.slice(-2).map((event, idx) => (
                      <div key={idx} className="text-xs p-2 bg-muted/50 rounded border">
                        <div className="font-medium truncate text-foreground">{event.actionType}</div>
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
                className="text-xs flex-1 bg-background"
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
                className="text-xs flex-1 bg-background"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export const EnhancedFlowVisualizer: React.FC = () => {
  const currentEvent = useSelector(selectCurrentEvent);
  const isAnimating = useSelector(selectIsAnimating);
  const latestEvents = useSelector(selectLatestEvents);
  const [showMiniMap, setShowMiniMap] = useState(false);

  return (
    <div className="w-full bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-foreground">
            🎯 Redux Flow
          </h3>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMiniMap(!showMiniMap)}
              className="text-xs h-6 px-2 hidden lg:flex"
            >
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Redux Flow Steps - Full width responsive layout, no scrollbar */}
        <div className="w-full">
          <div className="flex items-start gap-2 lg:gap-4 min-h-20 lg:min-h-24">
            {flowSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Card - equal flex sizing */}
                <div className="flex-1 min-w-0">
                  <StepCard
                    step={step}
                    index={index}
                    isActive={currentEvent?.type === step.id}
                    currentEvent={currentEvent}
                    latestEvents={latestEvents}
                  />
                </div>
                
                {/* Flow Line - between steps */}
                {index < flowSteps.length - 1 && (
                  <div className="flex-shrink-0 w-4 lg:w-8 flex items-center justify-center mt-10 lg:mt-12">
                    <motion.div
                      className="w-full h-0.5 lg:h-1 bg-gradient-to-r from-muted via-muted to-muted relative overflow-hidden rounded-full"
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
    </div>
  );
};