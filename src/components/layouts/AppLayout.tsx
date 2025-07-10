import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

type AppLayoutProps = {
  onLogout: () => void;
  projectInfo?: Record<string, any>; // Adjust type if you have a specific structure
};

const AppLayout: React.FC<AppLayoutProps> = ({ onLogout, projectInfo }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar onLogout={onLogout} />
    <div className="flex flex-col flex-1">
      <TopNavbar projectInfo={projectInfo} />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppLayout;
