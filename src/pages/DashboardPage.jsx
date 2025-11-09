import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Server, Shield, Users, Zap, Wifi, WifiOff } from 'lucide-react';
import { getApiUrl, getAuthHeaders } from '../config/api';
import { useProLogs } from '../hooks/useProLogs';

const DashboardPage = () => {
  const { logs, connected } = useProLogs('all');
  const [dashboardStats, setDashboardStats] = useState({
    recentScans: 0,
    systemUptime: '0%',
    aiTasks: 0,
    threatsDetected: 0,
    activeUsers: 1,
    responseTime: '--'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    cpu: 0,
    memory: 0,
    disk: 0
  });
  const [loading, setLoading] = useState(true);

  // Initialize dashboard with mock/default data
  useEffect(() => {
    // Set default stats based on logs
    const threats = logs.filter(log => 
      log.threat_status === 'Malicious' || log.threat_status === 'Suspicious'
    ).length;
    
    setDashboardStats({
      recentScans: logs.filter(l => l.category === 'file_scanning').length || 0,
      systemUptime: connected ? '99.9%' : '0%',
      aiTasks: logs.length || 0,
      threatsDetected: threats,
      activeUsers: connected ? 1 : 0,
      responseTime: connected ? '<50ms' : '--'
    });

    // Set recent activity from logs
    if (logs.length > 0) {
      const activities = logs.slice(-5).reverse().map(log => ({
        type: log.threat_status === 'Clean' ? 'success' : 'warning',
        message: `${log.event_type} - ${log.entity_path || 'System'} - ${log.threat_status}`,
        color: log.threat_status === 'Clean' ? 'green' : log.threat_status === 'Malicious' ? 'red' : 'yellow'
      }));
      setRecentActivity(activities);
    } else {
      setRecentActivity([
        { type: 'info', message: 'System initialized - No scans yet', color: 'blue' },
        { type: 'info', message: 'Click Refresh on any page to fetch logs', color: 'blue' }
      ]);
    }

    // Set system health metrics (mock data)
    setSystemHealth({
      cpu: connected ? Math.floor(Math.random() * 30) + 20 : 0, // 20-50%
      memory: connected ? Math.floor(Math.random() * 20) + 40 : 0, // 40-60%
      disk: connected ? Math.floor(Math.random() * 15) + 25 : 0 // 25-40%
    });

    setLoading(false);
  }, [logs, connected]);

  // Update stats from real-time logs
  useEffect(() => {
    if (logs.length > 0) {
      const threats = logs.filter(log => 
        log.threat_status === 'Malicious' || log.threat_status === 'Suspicious'
      );
      setDashboardStats(prev => ({
        ...prev,
        aiTasks: logs.filter(log => log.category === 'file_scanning' || log.category === 'network_analysis').length
      }));
    }
  }, [logs]);

  const stats = [
    {
      title: "Connection Status",
      value: connected ? "Online" : "Offline",
      description: connected ? "Real-time monitoring" : "Waiting for connection",
      icon: connected ? Wifi : WifiOff,
      color: connected ? "text-green-500" : "text-red-500"
    },
    {
      title: "AI Tasks",
      value: loading ? "--" : logs.length.toString(),
      description: "Events captured",
      icon: Shield,
      color: "text-orange-500"
    },
    {
      title: "Threats Detected",
      value: loading ? "--" : dashboardStats.threatsDetected.toString(),
      description: "Last 24 hours",
      icon: Shield,
      color: dashboardStats.threatsDetected > 0 ? "text-red-500" : "text-green-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Welcome to CyberRazor Pro Portal
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor your security infrastructure with advanced AI-powered tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 && logs.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No recent activity. Start pro.py to see logs.
                </div>
              ) : (
                logs.slice(-5).reverse().map((log, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      log.threat_status === 'Malicious' ? 'bg-red-500' :
                      log.threat_status === 'Suspicious' ? 'bg-yellow-500' :
                      log.threat_status === 'Clean' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}></div>
                    <span className="text-sm truncate">
                      {log.event_type} - {log.message.substring(0, 50)}{log.message.length > 50 ? '...' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">File Scans</span>
                <span className="text-sm font-medium">{logs.filter(l => l.category === 'file_scanning').length}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${Math.min(100, logs.filter(l => l.category === 'file_scanning').length * 2)}%`}}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Network Analysis</span>
                <span className="text-sm font-medium">{logs.filter(l => l.category === 'network_analysis').length}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: `${Math.min(100, logs.filter(l => l.category === 'network_analysis').length * 2)}%`}}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">CIA Audits</span>
                <span className="text-sm font-medium">{logs.filter(l => l.category === 'cia_audit').length}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: `${Math.min(100, logs.filter(l => l.category === 'cia_audit').length * 2)}%`}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
