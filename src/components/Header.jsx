import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Medal, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../AuthContext/AuthContext";
import boy from "../icon/boy.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoverInfoVisible, setHoverInfoVisible] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef();

  const maxXP = 1000;
  const maxLevel = 10;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
        setHoverInfoVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center relative">
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Medal className="w-6 h-6" />
          GamifyZone
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <Link to="/modules" className="hover:text-indigo-600 transition">Modules</Link>
          <Link to="/games/puzzle" className="hover:text-indigo-600 transition">Puzzle</Link>
          <Link to="/games/quiz" className="hover:text-indigo-600 transition">Quiz</Link>
          <Link to="/games/flashcard" className="hover:text-indigo-600 transition">Flashcard</Link>
          <Link to="/leaderboard" className="hover:text-indigo-600 transition">Leaderboard</Link>
        </nav>

        {/* Profile Section */}
        <div className="hidden md:flex items-center gap-4 relative" ref={profileRef}>
          {user ? (
            <>
              {/* Profile with Hover Info */}
              <div
                onMouseEnter={() => setHoverInfoVisible(true)}
                onMouseLeave={() => setHoverInfoVisible(false)}
                className="relative"
              >
                <button
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 focus:outline-none"
                >
                  <img
                    src={boy}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Hover User Info Box */}
                {hoverInfoVisible && !profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border rounded-xl shadow-xl px-5 py-4 z-50 text-sm">
                    <p className="text-base font-semibold text-gray-800 mb-2">{user.name}</p>

                    {/* Level Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Level</span>
                        <span>{user.level} / {maxLevel}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${(user.level / maxLevel) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* XP Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>XP</span>
                        <span>{user.xp} / {maxXP}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${(user.xp / maxXP) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border rounded-md shadow-lg py-3 z-50">
                  <Link
                    to="/user-dashboard"
                    className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    User Progress
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Update Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                Login
              </Link>
              <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-full hover:bg-indigo-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 text-sm space-y-2">
          <Link to="/" className="block py-2">Home</Link>
          <Link to="/modules" className="block py-2">Modules</Link>
          <Link to="/games/puzzle" className="block py-2">Puzzle</Link>
          <Link to="/games/quiz" className="block py-2">Quiz</Link>
          <Link to="/games/flashcard" className="block py-2">Flashcard</Link>
          <Link to="/leaderboard" className="block py-2">Leaderboard</Link>
          {user ? (
            <>
              <Link to="/profile" className="block py-2 text-indigo-600 font-medium">Update Profile</Link>
              <button
                onClick={handleLogout}
                className="block py-2 w-full text-left text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2">Login</Link>
              <Link to="/signup" className="block py-2">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
