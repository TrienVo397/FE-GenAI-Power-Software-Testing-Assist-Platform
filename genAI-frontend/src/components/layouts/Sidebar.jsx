import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, List, User } from 'lucide-react';

const Sidebar = () => {
  const linkClass =
    'flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition';

  const getActiveClass = ({ isActive }) =>
    isActive
      ? `${linkClass} bg-gray-100 text-[#0d1c1e]`
      : `${linkClass} text-[#f3faf1] hover:bg-gray-100 hover:text-black`;

  return (
    <aside className="w-56 bg-[#0d1c1e] h-screen shadow-sm flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-6">
        {/* Dashboard Section */}
        <div>
          <p className="text-xs font-semibold mb-2 text-[#f3faf1]">DASHBOARD</p>
          <NavLink to="/" end className={getActiveClass}>
            <Home size={16} />
            <span>Home</span>
          </NavLink>
        </div>

        {/* Testing Section */}
        <div>
          <p className="text-xs font-semibold mb-2 text-[#f3faf1]">TESTING</p>
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
          <p className="text-xs font-semibold mb-2 text-[#f3faf1]">SETTING</p>
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
