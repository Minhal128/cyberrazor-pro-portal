import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, CheckCircle, AlertCircle, AlertTriangle, Shield, Wifi, WifiOff, Trash2, RefreshCw } from 'lucide-react';
import { useProLogs } from '../hooks/useProLogs';

const FileScanningPage = () => {
  const { logs, connected, loading, clearLogs, refreshLogs } = useProLogs('file_scanning');

  const getThreatIcon = (status) => {
    switch (status) {
      case 'Malicious':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Suspicious':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Clean':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getThreatColor = (status) => {
    switch (status) {
      case 'Malicious':
        return 'text-red-500 bg-red-500/10 border-red-500';
      case 'Suspicious':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500';
      case 'Clean':
        return 'text-green-500 bg-green-500/10 border-green-500';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500';
    }
  };

  const [files, setFiles] = React.useState([]);
  const [results, setResults] = React.useState([]);

  const handleUpload = (event) => {
    if (event && event.target.files) {
      const fileList = Array.from(event.target.files);
      setFiles([...files, ...fileList]);
      
      fileList.forEach((file) => {
        const scanResult = {
          id: `${file.name}-${Date.now()}`,
          name: file.name,
          status: 'scanning',
          progress: 0
        };
        
        setResults(prev => [...prev, scanResult]);
        
        // Simulate scanning progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            setResults(prev => 
              prev.map(result => 
                result.id === scanResult.id 
                  ? { ...result, status: 'completed', progress: 100 }
                  : result
              )
            );
            clearInterval(interval);
          } else {
            setResults(prev => 
              prev.map(result => 
                result.id === scanResult.id 
                  ? { ...result, progress: Math.floor(progress) }
                  : result
              )
            );
          }
        }, 500);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            AI File Scanning
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time AI-powered file threat detection and analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-md ${connected ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span className="text-sm font-medium">{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <Button onClick={refreshLogs} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={clearLogs} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground">Events captured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {logs.filter(log => log.threat_status === 'Malicious' || log.threat_status === 'Suspicious').length}
            </div>
            <p className="text-xs text-muted-foreground">Active threats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clean Files</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {logs.filter(log => log.threat_status === 'Clean').length}
            </div>
            <p className="text-xs text-muted-foreground">No issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {connected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connected ? 'Live' : 'Offline'}</div>
            <p className="text-xs text-muted-foreground">Real-time monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Logs from pro.py */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Real-time File Scanning Logs</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No file scanning logs yet</p>
                <p className="text-sm">Start scanning with pro.py to see logs here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.slice().reverse().map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border ${getThreatColor(log.threat_status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getThreatIcon(log.threat_status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{log.event_type}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {log.entity_path}
                        </p>
                        <p className="text-xs mt-1">{log.message}</p>
                        {log.remarks && (
                          <p className="text-xs text-muted-foreground mt-1">{log.remarks}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-xs font-medium">{log.threat_status}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp * 1000).toLocaleTimeString()}
                      </span>
                      <span className="text-xs font-medium mt-1">{log.action_taken}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileScanningPage;