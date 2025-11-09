// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://cyberrazorbackend.vercel.app',
  WS_URL: 'wss://cyberrazorbackend.vercel.app/pro-logs',
  ENDPOINTS: {
    // Pro Portal Auth
    checkToken: '/api/pro/check-token',
    activate: '/api/pro/activate',
    login: '/api/pro/login',
    profile: '/api/pro/profile',
    updatePassword: '/api/pro/password',
    
    // Dashboard Stats
    dashboardStats: '/api/pro/dashboard-stats',
    recentActivity: '/api/pro/recent-activity',
    systemHealth: '/api/pro/system-health',
    
    // Scanning
    scans: '/api/scans',
    threats: '/api/threats',
    devices: '/api/devices'
  }
};

// Helper function to get full URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get headers with auth
export const getAuthHeaders = () => {
  const token = localStorage.getItem('proToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
