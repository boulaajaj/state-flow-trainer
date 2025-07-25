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
      <div className="space-y-8">
        {/* Enhanced Redux Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <EnhancedFlowVisualizer />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Modules Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <CounterModule />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TodoModule />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AuthModule />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <WeatherModule />
            </motion.div>
          </div>

          {/* Right Panel - Educational Tools */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ExplanationPanel />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <ActionLogger />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <StateInspector />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
