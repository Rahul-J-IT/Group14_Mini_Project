import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, GraduationCap } from "lucide-react";
import SearchBar from "./SearchBar";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Hide search bar on login / register pages
  const isAuthPage =
    location.pathname === "/userLogin" || location.pathname === "/userRegister";
  const showSearch = !!token && !isAuthPage;

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* ── LEFT: Hamburger + Logo ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <button
            onClick={() => navigate(token ? "/" : "/userLogin")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-lg tracking-tight hidden sm:block">
              LearnHub
            </span>
          </button>
        </div>

        {/* ── CENTER: Live Search (logged-in users only) ── */}
        {showSearch && <SearchBar />}

        {/* ── RIGHT: Profile / Logout or Sign In / Sign Up ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {token && user ? (
            <>
              <button
                onClick={() => navigate(`/user/profile/${user.id}`)}
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-700 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-all duration-200"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/userLogin");
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-xl shadow-md shadow-red-200 hover:shadow-red-300 transition-all duration-200 hover:-translate-y-0.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/userLogin")}
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-700 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-all duration-200"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate("/userRegister")}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-md shadow-violet-200 hover:shadow-violet-300 transition-all duration-200 hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
