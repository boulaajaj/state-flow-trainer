import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';
import { selectRootState, selectStateSlices } from '../store/reduxFlow.selectors';

export const StateInspector: React.FC = () => {
  const state = useSelector(selectRootState);
  const stateSlices = useSelector(selectStateSlices);
  const [isVisible, setIsVisible] = React.useState(true);

  const formatState = (obj: any, depth = 0): string => {
    if (depth > 3) return '...';
    
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        return `[${obj.length} items]`;
      }
      return JSON.stringify(obj, null, 2);
    }
    return String(obj);
  };


  return (
    <Card className="p-4 bg-card border-border h-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          State Inspector
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="text-xs"
        >
          {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </Button>
      </div>
      
      {isVisible ? (
        <Tabs defaultValue="overview" className="h-64">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="raw">Raw State</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <ScrollArea className="h-52">
              <div className="space-y-3">
                {stateSlices.map((slice) => (
                  <motion.div
                    key={slice.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-muted/30 rounded-lg border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm capitalize">{slice.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {slice.size}B
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {typeof slice.data === 'object' && slice.data !== null && (
                        <div className="space-y-1">
                          {Object.entries(slice.data).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <span className="font-medium">{key}:</span>
                              <span className="truncate">
                                {typeof value === 'string' ? `"${value}"` : 
                                 typeof value === 'number' ? value :
                                 typeof value === 'boolean' ? String(value) :
                                 Array.isArray(value) ? `[${value.length}]` :
                                 typeof value === 'object' ? '{...}' : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="raw" className="mt-4">
            <ScrollArea className="h-52">
              <pre className="text-xs bg-muted/30 p-3 rounded-lg overflow-x-auto">
                {formatState(state)}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click to inspect state</p>
          </div>
        </div>
      )}
    </Card>
  );
};