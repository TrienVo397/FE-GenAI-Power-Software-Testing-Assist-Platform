import { UserCircle2 } from 'lucide-react';
import AppLogo from "../../assets/app-logo.png"

const TopNavbar = () => {
  return (
    <header className="w-full h-16 bg-[#24416d] flex items-center justify-between px-6">
      {/* Site Name (Left) */}
      <div className="flex items-center gap-2 font-semibold text-lg">
        <img className='rounded-full w-10 h-10' src={AppLogo} alt="App Logo" />
        <span className="text-[#f3faf1]">SkyTest</span>
      </div>

      {/* User Avatar (Right) */}
      <UserCircle2 size={28} className="text-[#f3faf1]" />
    </header>
  );
};

export default TopNavbar;
