import React from 'react';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-redux-flow bg-clip-text text-transparent">
                Redux Educational App
              </h1>
              <p className="text-sm text-muted-foreground">
                Interactive Redux State Management Visualizer
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-action rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-reducer rounded-full animate-pulse delay-200" />
              <div className="w-2 h-2 bg-store rounded-full animate-pulse delay-300" />
              <div className="w-2 h-2 bg-selector rounded-full animate-pulse delay-500" />
              <div className="w-2 h-2 bg-render rounded-full animate-pulse delay-700" />
            </div>
          </div>
        </div>
      </motion.header>
      
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};