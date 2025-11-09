import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from 'lucide-react';
import logo from '../logo.png';

const TopBar = () => {
  const [userEmail, setUserEmail] = useState('User');

  useEffect(() => {
    const proUser = localStorage.getItem('proUser');
    if (proUser) {
      try {
        const user = JSON.parse(proUser);
        setUserEmail(user.email || 'User');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border">
      <div className="flex items-center justify-between h-full px-6">
        {/* App Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img src={logo} alt="CyberRazor Logo" className="w-28 h-18 rounded-lg" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              CyberRazor Pro
            </h1>
            <p className="text-xs text-muted-foreground">Security Portal</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium">{userEmail}</p>
            <p className="text-xs text-muted-foreground">Pro Portal</p>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
