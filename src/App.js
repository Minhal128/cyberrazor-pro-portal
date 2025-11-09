import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import FileScanningPage from './pages/FileScanningPage';
import NetworkScanningPage from './pages/NetworkScanningPage';
import CIAuditPage from './pages/CIAuditPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import './index.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/file-scanning" element={<Layout><FileScanningPage /></Layout>} />
        <Route path="/network-scanning" element={<Layout><NetworkScanningPage /></Layout>} />
        <Route path="/cia-audit" element={<Layout><CIAuditPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
