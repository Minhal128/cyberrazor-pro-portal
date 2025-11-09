import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
