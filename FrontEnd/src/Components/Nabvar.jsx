import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Upload, User, LogOut } from "lucide-react";
import Button from "../../components/button";
import { isTokenValid } from "../utils/auth";

const Navbar = ({ onLogout }) => {
  const [query, setQuery] = useState("");

  return (
    <header className="w-full border-b border-gray-200 bg-white font-[archivo]">
      {/* Top Nav */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo placeholder */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          [CSE-RSP]
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={18}
              className="absolute right-3 top-2.5 text-gray-400"
            />
          </div>
        </div>

        {/* Right side: Upload + Auth */}
        <div className="flex items-center space-x-4">
          <Link to="/upload" className="flex items-center text-gray-600 hover:text-gray-900">
            <Upload size={18} className="mr-1" /> Upload
          </Link>

          {isTokenValid() ? (
            <>
              <Link to="/profile">
                <User size={22} className="text-gray-600 hover:text-gray-900" />
              </Link>
              <button
                onClick={onLogout}
                className="flex items-center text-red-500 hover:text-red-700"
              >
                <LogOut size={18} className="mr-1" /> Logout
              </button>
            </>
          ) : (
            <Link to="/auth/login" className="flex items-center text-gray-600 hover:text-gray-900">
              <User size={18} className="mr-1" /> Sign in
            </Link>
          )}

          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Download free for 30 days
          </Button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-2 flex space-x-6 text-sm font-medium text-gray-700">
          <Link to="/academic" className="hover:text-black">Academic</Link>
          <Link to="/professional" className="hover:text-black">Professional</Link>
          <Link to="/culture" className="hover:text-black">Culture</Link>
          <Link to="/hobbies" className="hover:text-black">Hobbies & Crafts</Link>
          <Link to="/growth" className="hover:text-black">Personal Growth</Link>
          <Link to="/all" className="hover:text-black">All Documents</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
