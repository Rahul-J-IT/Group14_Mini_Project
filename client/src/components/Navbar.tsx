import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, GraduationCap } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const isAllCoursesPage = location.pathname.startsWith("/courses/");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* ================= LEFT SIDE ================= */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Hamburger */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-lg tracking-tight hidden sm:block">
              LearnHub
            </span>
          </a>
        </div>

        {/* ================= CENTER (SEARCH) ================= */}
        {!isAllCoursesPage && (
          <div className="flex-1 max-w-xl mx-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-200 ${searchFocused
                ? "border-violet-400 bg-white shadow-md shadow-violet-100 ring-2 ring-violet-100"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
            >
              <Search
                size={16}
                className={`transition-colors ${searchFocused ? "text-violet-500" : "text-slate-400"
                  }`}
              />

              <input
                type="text"
                placeholder="Search courses, topics, instructors..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
              />

              {searchValue && (
                <button
                  onClick={() => setSearchValue("")}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= RIGHT SIDE ================= */}
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
