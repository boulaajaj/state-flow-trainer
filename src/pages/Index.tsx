import React from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { EnhancedFlowVisualizer } from '@/features/reduxFlow/components/EnhancedFlowVisualizer';
import { ExplanationPanel } from '@/features/reduxFlow/components/ExplanationPanel';
import { ActionLogger } from '@/features/reduxFlow/components/ActionLogger';
import { StateInspector } from '@/features/reduxFlow/components/StateInspector';
import { CounterModule } from '@/modules/Counter/components/CounterModule';
import { TodoModule } from '@/modules/Todo/components/TodoModule';
import { AuthModule } from '@/modules/Auth/components/AuthModule';
import { WeatherModule } from '@/modules/Weather/components/WeatherModule';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <AppLayout>
      {/* Sticky Redux Flow Playground */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-4"
        >
          <EnhancedFlowVisualizer />
        </motion.div>
      </div>

      {/* Scrollable Content */}
      <div className="space-y-8">
        {/* Weather Module */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <WeatherModule />
        </motion.div>

        {/* Latest Actions and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ExplanationPanel />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ActionLogger />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StateInspector />
          </motion.div>
        </div>

        {/* Interactive Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <CounterModule />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <TodoModule />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <AuthModule />
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
