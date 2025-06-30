import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopNavbar from './TopNavbar.jsx';

const AppLayout = ({ onLogout, projectInfo }) => (
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
