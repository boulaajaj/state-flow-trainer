import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LogIn, LogOut, User, Shield } from 'lucide-react';
import { selectUser, selectIsAuthenticated, selectAuthLoading } from '../store/auth.selectors';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/auth.slice';

export const AuthModule: React.FC = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('demo@example.com');
  const [name, setName] = useState('Demo User');

  const handleLogin = async () => {
    dispatch(loginStart());
    
    // Simulate API call
    setTimeout(() => {
      if (email && name) {
        dispatch(loginSuccess({
          id: '1',
          email,
          name,
          role: email.includes('admin') ? 'admin' : 'user'
        }));
      } else {
        dispatch(loginFailure('Please fill in all fields'));
      }
    }, 1000);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Auth Module</h2>
        <Badge variant={isAuthenticated ? 'default' : 'secondary'}>
          {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </Badge>
      </div>
      
      {!isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </>
            )}
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            <p>Try 'admin@example.com' for admin role</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
              <Shield className="w-3 h-3 mr-1" />
              {user?.role}
            </Badge>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      )}
    </Card>
  );
};