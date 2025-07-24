import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectCurrentEvent, selectIsAnimating } from '../store/reduxFlow.selectors';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const flowSteps = [
  { id: 'action', label: 'Action Dispatched', color: 'action' },
  { id: 'reducer', label: 'Reducer Processing', color: 'reducer' },
  { id: 'store', label: 'Store Updated', color: 'store' },
  { id: 'selector', label: 'Selectors Fired', color: 'selector' },
  { id: 'render', label: 'Components Re-rendered', color: 'render' },
];

export const ReduxFlowVisualizer: React.FC = () => {
  const currentEvent = useSelector(selectCurrentEvent);
  const isAnimating = useSelector(selectIsAnimating);

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Redux Flow Visualization
      </h3>
      
      <div className="flex items-center justify-between mb-4">
        {flowSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <motion.div
              className={`
                relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300
                ${currentEvent?.type === step.id
                  ? `border-${step.color} bg-${step.color}/10 shadow-${step.color}-glow`
                  : 'border-border bg-muted/30'
                }
              `}
              animate={currentEvent?.type === step.id ? {
                scale: [1, 1.1, 1],
                rotateY: [0, 5, 0],
              } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${currentEvent?.type === step.id
                  ? `bg-${step.color} text-white`
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {index + 1}
              </div>
              
              <span className={`
                mt-2 text-xs text-center font-medium max-w-20
                ${currentEvent?.type === step.id
                  ? `text-${step.color}`
                  : 'text-muted-foreground'
                }
              `}>
                {step.label}
              </span>
              
              {currentEvent?.type === step.id && (
                <motion.div
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-${step.color} animate-ping`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                />
              )}
            </motion.div>
            
            {index < flowSteps.length - 1 && (
              <motion.div
                className="flex-1 h-1 mx-2 bg-gradient-to-r from-muted to-muted relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AnimatePresence>
                  {isAnimating && (
                    <motion.div
                      className="absolute inset-0 bg-redux-flow-gradient"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'linear'
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <AnimatePresence>
        {currentEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-4 bg-muted/50 rounded-lg border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                {currentEvent.actionType}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(currentEvent.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            {currentEvent.payload && (
              <div className="text-sm">
                <span className="font-semibold">Payload:</span>
                <pre className="mt-1 text-xs bg-background p-2 rounded overflow-x-auto">
                  {JSON.stringify(currentEvent.payload, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};