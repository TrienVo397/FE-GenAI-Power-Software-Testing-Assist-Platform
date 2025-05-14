import { UserCircle2 } from 'lucide-react';

const TopNavbar = () => {
  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Site Name (Left) */}
      <div className="flex items-center gap-2 font-semibold text-lg">
        <span className="text-2xl">🌐</span>
        <span>Site name</span>
      </div>

      {/* User Avatar (Right) */}
      <UserCircle2 size={28} className="text-gray-600" />
    </header>
  );
};

export default TopNavbar;
