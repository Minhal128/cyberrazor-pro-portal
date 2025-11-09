import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, Brain, Network, Shield, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('proToken');
    localStorage.removeItem('proUser');
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Brain, label: 'AI File Scanning', path: '/file-scanning' },
    { icon: Network, label: 'AI Network Scanning', path: '/network-scanning' },
    { icon: Shield, label: 'Complete CIA Audit', path: '/cia-audit' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-left h-12",
                isActive(item.path) && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <IconComponent className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Exit
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
