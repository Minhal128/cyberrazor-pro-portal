import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Lock, Database, CheckCircle, AlertTriangle, Wifi, WifiOff, Trash2, RefreshCw, Server } from 'lucide-react';
import { useProLogs } from '../hooks/useProLogs';
import { Button } from '../components/ui/button';

const CIAuditPage = () => {
  const { logs, connected, loading, clearLogs, refreshLogs } = useProLogs('cia_audit');

  // Calculate dynamic scores based on logs
  const auditResults = useMemo(() => {
    const totalLogs = logs.length || 1; // Avoid division by zero
    const cleanLogs = logs.filter(log => log.threat_status === 'Clean').length;
    const threats = logs.filter(log => log.threat_status === 'Malicious' || log.threat_status === 'Suspicious').length;

    // Calculate scores (higher is better)
    const baseScore = Math.round((cleanLogs / totalLogs) * 100) || 95;
    const threatPenalty = Math.min(threats * 5, 30); // Max 30% penalty

    const confidentialityLogs = logs.filter(log => log.message?.toLowerCase().includes('confidential') || log.event_type?.toLowerCase().includes('encryption'));
    const integrityLogs = logs.filter(log => log.message?.toLowerCase().includes('integrity') || log.event_type?.toLowerCase().includes('verification'));
    const availabilityLogs = logs.filter(log => log.message?.toLowerCase().includes('availability') || log.event_type?.toLowerCase().includes('uptime'));

    return [
      {
        title: "Confidentiality",
        icon: Lock,
        score: totalLogs > 0 ? Math.max(50, baseScore - threatPenalty) : 95,
        status: totalLogs === 0 ? "Awaiting Data" : baseScore - threatPenalty >= 90 ? "Secure" : baseScore - threatPenalty >= 70 ? "Good" : "Needs Attention",
        details: [
          `Encryption Checks: ${confidentialityLogs.length > 0 ? `${confidentialityLogs.length} performed` : 'Waiting for agent...'}`,
          `Access Controls: ${connected ? 'Active monitoring' : 'Start agent to monitor'}`,
          `Clean Results: ${confidentialityLogs.length > 0 ? `${confidentialityLogs.filter(l => l.threat_status === 'Clean').length}/${confidentialityLogs.length}` : 'No data yet'}`,
          `AI Analysis: ${totalLogs === 0 ? 'Waiting for scan data' : threats === 0 ? 'No vulnerabilities' : `${threats} issues detected`}`
        ],
        color: totalLogs === 0 ? "text-gray-500" : baseScore - threatPenalty >= 90 ? "text-green-500" : "text-yellow-500",
        logCount: confidentialityLogs.length
      },
      {
        title: "Integrity",
        icon: CheckCircle,
        score: totalLogs > 0 ? Math.max(50, baseScore - Math.floor(threatPenalty * 0.8)) : 95,
        status: totalLogs === 0 ? "Awaiting Data" : baseScore >= 90 ? "Good" : baseScore >= 70 ? "Fair" : "Review Needed",
        details: [
          `Integrity Checks: ${integrityLogs.length > 0 ? `${integrityLogs.length} performed` : 'Waiting for agent...'}`,
          `Hash Verifications: ${integrityLogs.length > 0 ? `${integrityLogs.filter(l => l.threat_status === 'Clean').length} valid` : 'No data yet'}`,
          `Version Control: ${connected ? 'Monitoring enabled' : 'Start agent to monitor'}`,
          `AI Anomaly Detection: ${totalLogs === 0 ? 'Waiting for scan data' : `Risk score ${threats}/100`}`
        ],
        color: totalLogs === 0 ? "text-gray-500" : baseScore >= 90 ? "text-blue-500" : "text-yellow-500",
        logCount: integrityLogs.length
      },
      {
        title: "Availability",
        icon: Server,
        score: totalLogs > 0 ? (connected ? Math.max(80, baseScore) : 50) : 95,
        status: totalLogs === 0 ? "Awaiting Data" : connected ? "Excellent" : "Limited",
        details: [
          `System Status: ${connected ? 'Online' : 'Start agent to connect'}`,
          `Availability Checks: ${availabilityLogs.length > 0 ? `${availabilityLogs.length} performed` : 'Waiting for agent...'}`,
          `Monitoring: ${connected ? 'Real-time active' : 'Start pro_agent.py'}`,
          `AI Threat Detection: ${totalLogs === 0 ? 'Waiting for scan data' : connected ? 'Active' : 'Inactive'}`
        ],
        color: totalLogs === 0 ? "text-gray-500" : connected ? "text-purple-500" : "text-red-500",
        logCount: availabilityLogs.length
      }
    ];
  }, [logs, connected]);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Complete CIA Audit
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time analysis of Confidentiality, Integrity, and Availability
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {auditResults.map((audit, index) => {
          const IconComponent = audit.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-6 w-6 ${audit.color}`} />
                    <span>{audit.title}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{audit.score}%</div>
                    <div className={`text-sm ${audit.color}`}>{audit.status}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {audit.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full ${audit.color.replace('text', 'bg')} mt-2 flex-shrink-0`}></div>
                      <p className="text-sm text-muted-foreground">{detail}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${audit.color.replace('text', 'bg')}`}
                      style={{width: `${audit.score}%`}}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CIAuditPage;
