import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { selectFilteredTodos, selectTodoFilter, selectTodoStats } from '../store/todo.selectors';
import { addTodo, toggleTodo, deleteTodo, editTodo, setFilter, clearCompleted } from '../store/todo.slice';

export const TodoModule: React.FC = () => {
  const todos = useSelector(selectFilteredTodos);
  const filter = useSelector(selectTodoFilter);
  const stats = useSelector(selectTodoStats);
  const dispatch = useDispatch();

  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      dispatch(addTodo(newTodoText.trim()));
      setNewTodoText('');
    }
  };

  const handleEditStart = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleEditSave = () => {
    if (editingId && editingText.trim()) {
      dispatch(editTodo({ id: editingId, text: editingText.trim() }));
      setEditingId(null);
      setEditingText('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText('');
  };

  const filterButtons = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'active', label: 'Active', count: stats.active },
    { key: 'completed', label: 'Completed', count: stats.completed },
  ] as const;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Todo Module</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(clearCompleted())}
          disabled={stats.completed === 0}
        >
          Clear Completed
        </Button>
      </div>
      
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new todo..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          className="flex-1"
        />
        <Button onClick={handleAddTodo} className="px-4">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex gap-2 mb-6">
        {filterButtons.map(({ key, label, count }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => dispatch(setFilter(key))}
          >
            {label}
            <Badge variant="secondary" className="ml-2">
              {count}
            </Badge>
          </Button>
        ))}
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => dispatch(toggleTodo(todo.id))}
              />
              
              {editingId === todo.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleEditSave}>
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleEditCancel}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 ${
                      todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditStart(todo.id, todo.text)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch(deleteTodo(todo.id))}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {todos.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No todos to show. Add one above!
          </p>
        )}
      </div>
    </Card>
  );
};