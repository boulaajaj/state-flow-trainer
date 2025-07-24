import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { selectCounterValue, selectCounterStep } from '../store/counter.selectors';
import { increment, decrement, reset, setStep } from '../store/counter.slice';

export const CounterModule: React.FC = () => {
  const value = useSelector(selectCounterValue);
  const step = useSelector(selectCounterStep);
  const dispatch = useDispatch();

  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStep = parseInt(e.target.value) || 1;
    dispatch(setStep(newStep));
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Counter Module</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(reset())}
          className="text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>
      
      <div className="text-center mb-6">
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-6xl font-bold text-primary mb-2"
        >
          {value}
        </motion.div>
        <p className="text-sm text-muted-foreground">Current Count</p>
      </div>
      
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => dispatch(decrement())}
          className="w-12 h-12 p-0"
        >
          <Minus className="w-5 h-5" />
        </Button>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            size="lg"
            onClick={() => dispatch(increment())}
            className="px-8 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add {step}
          </Button>
        </motion.div>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => dispatch(increment())}
          className="w-12 h-12 p-0"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4 justify-center">
        <Label htmlFor="step" className="text-sm font-medium">
          Step Size:
        </Label>
        <Input
          id="step"
          type="number"
          value={step}
          onChange={handleStepChange}
          className="w-20 h-8 text-center"
          min="1"
        />
      </div>
    </Card>
  );
};