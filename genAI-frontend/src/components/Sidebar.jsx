import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, List, User } from 'lucide-react';

const Sidebar = () => {
  const linkClass =
    'flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition';

  const getActiveClass = ({ isActive }) =>
    isActive
      ? `${linkClass} bg-blue-100 text-blue-900`
      : `${linkClass} text-gray-700 hover:bg-gray-100 hover:text-black`;

  return (
    <aside className="w-56 bg-white h-screen shadow-sm flex flex-col border-r">
      <nav className="flex-1 px-4 py-6 space-y-6">
        {/* Dashboard Section */}
        <div>
          <p className="text-xs font-semibold mb-2 text-gray-500">DASHBOARD</p>
          <NavLink to="/" end className={getActiveClass}>
            <Home size={16} />
            <span>Home</span>
          </NavLink>
        </div>

        {/* Testing Section */}
        <div>
          <p className="text-xs font-semibold mb-2 text-gray-500">TESTING</p>
          <div className="space-y-1">
            <NavLink to="/new-test" className={getActiveClass}>
              <PlusCircle size={16} />
              <span>New Test</span>
            </NavLink>
            <NavLink to="/all-tests" className={getActiveClass}>
              <List size={16} />
              <span>All Tests</span>
            </NavLink>
          </div>
        </div>

        {/* Setting Section */}
        <div>
          <p className="text-xs font-semibold mb-2 text-gray-500">SETTING</p>
          <NavLink to="/profile" className={getActiveClass}>
            <User size={16} />
            <span>Profile</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
