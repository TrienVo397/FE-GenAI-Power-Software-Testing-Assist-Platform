import { NavLink } from "react-router-dom";
import { Home, PlusCircle, List, User, LogOut } from "lucide-react";

const Sidebar = ({ onLogout }) => {
  const linkClass =
    "flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition";

  const getActiveClass = ({ isActive }) =>
    isActive
      ? `${linkClass} bg-[#f3faf1] text-[#0d1c1e]`
      : `${linkClass} text-[#f3faf1] hover:bg-[#f3faf1] hover:text-black`;

  return (
    <aside className="w-56 bg-[#0d1c1e] h-screen shadow-sm flex flex-col justify-between">
      <nav className="px-4 py-6 space-y-6">
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

      <div className="px-4 py-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-[#f3faf1] text-red-600 w-full text-left cursor-pointer transition font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
