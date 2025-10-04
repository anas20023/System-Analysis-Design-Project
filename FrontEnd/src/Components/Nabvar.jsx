import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Upload, User, LogOut, ChevronDown, Menu, X } from "lucide-react";
import Button from "../../components/button";
import { isTokenValid } from "../utils/auth";

const Navbar = ({ onLogout }) => {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = (menu) => {
    setDropdownOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navItems = [
    { title: "Academic", sub: ["Assignments", "Lecture Notes", "Research Papers"] },
    { title: "Professional", sub: ["Resumes", "Certifications", "Case Studies"] },
    { title: "Culture", sub: ["Articles", "Essays", "Stories"] },
    { title: "Hobbies & Crafts", sub: ["DIY", "Art", "Photography"] },
    { title: "Personal Growth", sub: ["Books", "Workshops", "Self-Help"] },
    { title: "All Documents", sub: ["All Types", "Trending", "Recent"] },
  ];

  return (
    <header className="w-full border-b border-gray-200 bg-white font-[archivo]">
      {/* Top Nav */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          [CSE-RSP]
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Right side: Upload + Auth */}
        <div className="hidden md:flex items-center space-x-4">
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

          <Button variant="" className="bg-slate-800 hover:bg-slate-700 text-white">
            Download free for 30 days
          </Button>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col md:flex-row md:space-x-6 text-sm font-medium text-gray-700">

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => setDropdownOpen({ [item.title]: true })}
                onMouseLeave={() => setDropdownOpen({ [item.title]: false })}
              >
                <button className="flex items-center hover:text-black">
                  {item.title} <ChevronDown size={16} className="ml-1" />
                </button>

                {/* Dropdown with animation */}
                <div
                  className={`absolute left-0 mt-2 w-44 bg-white shadow-lg border rounded-md z-50 overflow-hidden transition-all duration-300 ease-in-out
                    ${dropdownOpen[item.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                  `}
                >
                  {item.sub.map((subItem, i) => (
                    <Link
                      key={subItem}
                      to={`/${item.title.toLowerCase()}/${subItem.toLowerCase().replace(/ /g, "-")}`}
                      className={`block px-4 py-2 hover:bg-gray-100 transform transition-all duration-300 ease-out
                        ${dropdownOpen[item.title]
                          ? "opacity-100 translate-y-0 delay-" + (i * 75)
                          : "opacity-0 -translate-y-2 delay-0"}
                      `}
                    >
                      {subItem}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="flex flex-col md:hidden mt-2 space-y-1">
              {navItems.map((item) => (
                <div key={item.title} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className="flex justify-between w-full px-2 py-1 text-left hover:text-black"
                  >
                    {item.title} <ChevronDown size={16} />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                      ${dropdownOpen[item.title] ? "max-h-96" : "max-h-0"}
                    `}
                  >
                    {item.sub.map((subItem, i) => (
                      <Link
                        key={subItem}
                        to={`/${item.title.toLowerCase()}/${subItem.toLowerCase().replace(/ /g, "-")}`}
                        className={`block px-2 py-1 hover:bg-gray-100 rounded transform transition-all duration-300 ease-out
                          ${dropdownOpen[item.title]
                            ? "opacity-100 translate-y-0 delay-" + (i * 75)
                            : "opacity-0 -translate-y-2 delay-0"}
                        `}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
