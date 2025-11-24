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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setDropdownOpen({});
  };

  const navItems = [
    { 
      title: "Academic", 
      sub: [
        { name: "Assignments", category: "Academic", type: "Assignments" },
        { name: "Lecture Notes", category: "Academic", type: "Lecture Notes" },
        { name: "Research Papers", category: "Academic", type: "Research Papers" }
      ] 
    },
    { 
      title: "Professional", 
      sub: [
        { name: "Resumes", category: "Professional", type: "Resumes" },
        { name: "Certifications", category: "Professional", type: "Certifications" },
        { name: "Case Studies", category: "Professional", type: "Case Studies" }
      ] 
    },
    { 
      title: "Culture", 
      sub: [
        { name: "Articles", category: "Culture", type: "Articles" },
        { name: "Essays", category: "Culture", type: "Essays" },
        { name: "Stories", category: "Culture", type: "Stories" }
      ] 
    },
    { 
      title: "Hobbies & Crafts", 
      sub: [
        { name: "DIY", category: "Hobbies & Crafts", type: "DIY" },
        { name: "Art", category: "Hobbies & Crafts", type: "Art" },
        { name: "Photography", category: "Hobbies & Crafts", type: "Photography" }
      ] 
    },
    { 
      title: "Personal Growth", 
      sub: [
        { name: "Books", category: "Personal Growth", type: "Books" },
        { name: "Workshops", category: "Personal Growth", type: "Workshops" },
        { name: "Self-Help", category: "Personal Growth", type: "Self-Help" }
      ] 
    },
    { 
      title: "All Documents", 
      sub: [
        { name: "All Types", category: "All", type: "All" },
        { name: "Trending", category: "All", type: "Trending" },
        { name: "Recent", category: "All", type: "Recent" }
      ] 
    },
  ];

  // Function to build resources URL with query parameters
  const getResourcesLink = (category, type) => {
    if (category === "All" && type === "All") {
      return "/resources";
    }
    
    const params = new URLSearchParams();
    if (category !== "All") {
      params.append("category", category);
    }
    if (type !== "All") {
      params.append("type", type);
    }
    
    return `/resources?${params.toString()}`;
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white font-[archivo]">
      {/* Top Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <Link 
          to="/" 
          className="text-xl font-bold tracking-wide md:flex-1 md:max-w-none mx-auto md:mx-0 text-center md:text-left"
          onClick={closeMobileMenu}
        >
          [CSE-RSP]
        </Link>

        {/* Search Bar - Desktop */}
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

        {/* Right side: Upload + Auth - Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/upload" className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
            <Upload size={18} className="mr-1" /> Upload
          </Link>

          {isTokenValid() ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900 flex flex-row gap-0.5 items-center text-sm">
                <User size={18} />
                <p>Profile</p>
              </Link>
              <button
                onClick={onLogout}
                className="flex items-center text-red-500 hover:text-red-700 text-sm"
              >
                <LogOut size={18} className="mr-1" /> Logout
              </button>
            </>
          ) : (
            <Link to="/auth/login" className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
              <User size={18} className="mr-1" /> Sign in
            </Link>
          )}

          <Button variant="" className="bg-slate-800 hover:bg-slate-700 text-white text-sm whitespace-nowrap">
            Download free
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden mt-16">
          <div className="flex flex-col h-full">
            {/* Search Bar - Mobile */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full rounded-md border border-gray-300 px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search size={18} className="absolute right-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Navigation Items - Mobile */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {navItems.map((item) => (
                  <div key={item.title} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className="flex justify-between w-full px-2 py-2 text-left hover:text-black font-medium text-gray-700"
                    >
                      {item.title} 
                      <ChevronDown 
                        size={16} 
                        className={`transform transition-transform ${
                          dropdownOpen[item.title] ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        dropdownOpen[item.title] ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="pl-4 pt-2 space-y-2">
                        {item.sub.map((subItem, i) => (
                          <Link
                            key={i}
                            to={getResourcesLink(subItem.category, subItem.type)}
                            className={`block px-2 py-2 hover:bg-gray-100 rounded transform transition-all duration-300 ease-out text-gray-600 ${
                              dropdownOpen[item.title]
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-2"
                            }`}
                            onClick={closeMobileMenu}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auth Section - Mobile */}
            <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
              <Link 
                to="/upload" 
                className="flex items-center text-gray-600 hover:text-gray-900 py-2 text-sm font-medium"
                onClick={closeMobileMenu}
              >
                <Upload size={18} className="mr-3" /> Upload
              </Link>

              {isTokenValid() ? (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center text-gray-600 hover:text-gray-900 py-2 text-sm font-medium"
                    onClick={closeMobileMenu}
                  >
                    <User size={18} className="mr-3" /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      closeMobileMenu();
                    }}
                    className="flex items-center text-red-500 hover:text-red-700 py-2 text-sm font-medium w-full text-left"
                  >
                    <LogOut size={18} className="mr-3" /> Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth/login" 
                  className="flex items-center text-gray-600 hover:text-gray-900 py-2 text-sm font-medium"
                  onClick={closeMobileMenu}
                >
                  <User size={18} className="mr-3" /> Sign in
                </Link>
              )}

              <Button 
                variant="" 
                className="bg-slate-800 hover:bg-slate-700 text-white w-full justify-center text-sm py-3"
                onClick={closeMobileMenu}
              >
                Download free for 30 days
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav - Desktop */}
      <nav className="hidden md:block border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 justify-center flex flex-col md:flex-row md:space-x-6 text-sm font-medium text-gray-700">
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => setDropdownOpen({ [item.title]: true })}
                onMouseLeave={() => setDropdownOpen({ [item.title]: false })}
              >
                <button className="flex items-center text-[12pt] hover:text-black">
                  {item.title} <ChevronDown size={16} className="ml-1" />
                </button>

                {/* Dropdown with animation */}
                <div
                  className={`absolute left-0 mt-2 w-44 bg-white shadow-lg border rounded z-50 overflow-hidden transition-all duration-300 ease-in-out
                    ${dropdownOpen[item.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                  `}
                >
                  {item.sub.map((subItem, i) => (
                    <Link
                      key={subItem.name}
                      to={getResourcesLink(subItem.category, subItem.type)}
                      className={`block px-4 py-2 text-[11pt] hover:bg-gray-100 transform transition-all duration-300 ease-out
                        ${dropdownOpen[item.title]
                          ? "opacity-100 translate-y-0 delay-" + (i * 75)
                          : "opacity-0 -translate-y-2 delay-0"}
                      `}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;