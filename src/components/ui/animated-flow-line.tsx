import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedFlowLineProps {
  isActive: boolean;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  color?: string;
}

export const AnimatedFlowLine: React.FC<AnimatedFlowLineProps> = ({
  isActive,
  className,
  direction = 'horizontal',
  color = 'primary'
}) => {
  const isHorizontal = direction === 'horizontal';
  
  return (
    <div className={cn(
      "relative overflow-hidden rounded-full bg-muted",
      isHorizontal ? "h-1 w-full" : "w-1 h-full",
      className
    )}>
      {/* Animated glow effect */}
      {isActive && (
        <>
          <motion.div
            className={`absolute inset-0 bg-${color} opacity-30 rounded-full`}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Moving particle effect */}
          <motion.div
            className={`absolute bg-${color} rounded-full shadow-${color}-glow`}
            style={{
              width: isHorizontal ? '12px' : '100%',
              height: isHorizontal ? '100%' : '12px',
            }}
            initial={{
              [isHorizontal ? 'left' : 'top']: '-12px',
              opacity: 0
            }}
            animate={{
              [isHorizontal ? 'left' : 'top']: '100%',
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.1, 0.9, 1]
            }}
          />
          
          {/* Trail effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-${isHorizontal ? 'r' : 'b'} from-transparent via-${color}/50 to-transparent rounded-full`}
            initial={{
              [isHorizontal ? 'x' : 'y']: '-100%',
            }}
            animate={{
              [isHorizontal ? 'x' : 'y']: '100%',
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </>
      )}
    </div>
  );
};