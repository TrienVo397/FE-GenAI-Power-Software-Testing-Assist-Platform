import { NavLink } from "react-router-dom";
import { Home, PlusCircle, List, User, LogOut, Settings } from "lucide-react";

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
            <NavLink to="/files" className={getActiveClass}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"></path>
              </svg>
              <span>File Explorer</span>
            </NavLink>
            <NavLink to="/new-test" className={getActiveClass}>
              <PlusCircle size={16} />
              <span>New Test</span>
            </NavLink>

            <NavLink to="/artifacts" className={getActiveClass}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Artifacts</span>
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
          <div className="space-y-1">
            <NavLink to="/project-settings" className={getActiveClass}>
              <Settings size={16} />
              <span>Project Settings</span>
            </NavLink>

            <NavLink to="/profile" className={getActiveClass}>
              <User size={16} />
              <span>Profile</span>
            </NavLink>
          </div>
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
