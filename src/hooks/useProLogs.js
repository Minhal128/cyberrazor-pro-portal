import { useState, useEffect, useCallback } from 'react';

export const useProLogs = (category = 'all') => {
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in and set connected status
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const proUser = localStorage.getItem('proUser');
    
    if (accessToken && proUser) {
      setConnected(true);
      console.log('✅ User logged in - Connection status: Connected');
    } else {
      setConnected(false);
    }
  }, []);

  // Function to fetch logs (called manually or on interval)
  const fetchLogs = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      console.warn('No access token found');
      return;
    }

    setLoading(true);
    
    try {
      // Fetch logs from backend API
      const response = await fetch(
        `https://cyberrazorbackend.vercel.app/api/pro/logs?category=${category}&limit=100`,
        {
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.logs) {
        // Replace existing logs with new ones from API
        setLogs(data.logs);
        console.log(`📊 Fetched ${data.logs.length} logs from backend`);
      } else {
        console.warn('No logs received from backend');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      // Don't show error to user, just log it
    } finally {
      setLoading(false);
    }
  }, [category]);

  const clearLogs = () => {
    setLogs([]);
    console.log('🗑️ Logs cleared');
  };

  const refreshLogs = () => {
    console.log('🔄 Refreshing logs...');
    fetchLogs();
  };

  // Auto-fetch logs on mount and set up periodic refresh
  useEffect(() => {
    if (connected) {
      // Initial fetch
      fetchLogs();
      
      // Auto-refresh every 10 seconds
      const intervalId = setInterval(() => {
        fetchLogs();
      }, 10000); // 10 seconds
      
      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [connected, fetchLogs]);

  return { 
    logs, 
    connected, 
    loading,
    clearLogs, 
    refreshLogs,
    fetchLogs 
  };
};
