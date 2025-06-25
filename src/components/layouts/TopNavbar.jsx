import { NavLink, useNavigate } from "react-router-dom";
import { UserCircle2, FolderPlus } from "lucide-react";
import AppLogo from "../../assets/app-logo.png";
import Button from "../ui/Button";
import _ from "lodash";

const TopNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full h-16 bg-[#24416d] flex items-center justify-between px-6">
      {/* Site Name (Left) */}
      <NavLink to="/" end>
        <div className="flex items-center gap-2 font-semibold text-lg">
          <img
            className="rounded-full w-10 h-10"
            src={AppLogo}
            alt="App Logo"
          />
          <span className="text-[#f3faf1]">SkyTest</span>
        </div>
      </NavLink>

      {/* Right Section: Choose Project Button & User Avatar */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={_.debounce(() => navigate('/projects'), 300)}
          variant="outline" 
          size="sm"
          className="bg-transparent border-white text-white hover:bg-white/10 flex items-center"
        >
          <FolderPlus size={16} className="mr-2" />
          Choose Project
        </Button>
        
        <NavLink to="/profile">
          <UserCircle2 size={28} className="text-[#f3faf1]" />
        </NavLink>
      </div>
    </header>
  );
};

export default TopNavbar;
