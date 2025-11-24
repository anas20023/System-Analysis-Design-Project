import { useEffect, useState } from "react";
import ResourceManage from "../Components/Presentation/ResourceManage";
import Statistics from "../Components/Presentation/Statistics";
import SubscriptionManage from "../Components/Presentation/SubscriptionManage";
import UserManage from "../Components/Presentation/UserManage";
import axios from "axios";
import { Lock, Shield, Users, FileText, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";

const Manage = () => {
  const [user, setUser] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const url = import.meta.env.VITE_SERVER;

  // Admin login credentials (in real app, this would be handled by backend)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (loginData.username === ADMIN_CREDENTIALS.username &&
      loginData.password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      setError("");
      // In real app, you would set a token here
      localStorage.setItem('adminToken', 'fake-admin-token');
    } else {
      setError("Invalid admin credentials");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: "", password: "" });
    localStorage.removeItem('adminToken');
  };

  const getUser = async () => {
    try {
      const res = await axios.get(`${url}/users`);
     // console.log("Users data:", res);
      setUser(res.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${url}/users/drop/${id}`);
      setUser(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    // Fetch users when admin logs in
    if (isLoggedIn) {
      console.log("Admin logged in, fetching users...");
      getUser();
    }
  }, [isLoggedIn]); // Changed from [loginData] to [isLoggedIn]

  // Admin Login Panel
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-white/70">Enter your admin credentials to continue</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter admin username"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-slate-900 py-3 px-4 rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900 mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock size={18} className="mr-2" />
                    Sign in to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60 text-sm text-center">
                Demo credentials: <br />
                <span className="font-mono">admin / admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 lg:justify-center">
          <div className="flex items-center space-x-3">
            <Shield className="text-white" size={28} />
            <span className="text-white text-xl font-bold">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "users", label: "User Management", icon: Users },
            { id: "resources", label: "Resource Management", icon: FileText },
            { id: "subscriptions", label: "Subscriptions", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-2 px-2 cursor-pointer py-3 rounded-lg transition-colors ${activeSection === item.id
                ? "bg-slate-700 text-white"
                : "text-white/70 hover:text-white hover:bg-slate-700/50"
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 lg:static">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>

            <div className="flex-1 lg:flex-none">
              <h1 className="text-xl font-semibold text-gray-900 capitalize">
                {activeSection.replace('-', ' ')}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Administrator</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Dashboard Overview */}
            {activeSection === "dashboard" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Admin</h2>
                  <p className="text-gray-600">Here's what's happening with your platform today.</p>
                </div>

                {/* Statistics Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Overview</h2>
                  <Statistics />
                </div>

                {/* Users Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Users Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800">Total Users</h3>
                      <p className="text-2xl font-bold text-blue-600">{user.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800">Active Users</h3>
                      <p className="text-2xl font-bold text-green-600">{user.length}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800">New Today</h3>
                      <p className="text-2xl font-bold text-purple-600">0</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Management */}
            {activeSection === "users" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                  <button
                    onClick={getUser}
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Refresh Users
                  </button>
                </div>
                {user.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Users Found</h3>
                    <p className="text-gray-500 mb-4">There are no users in the system or there was an error loading users.</p>
                    <button
                      onClick={getUser}
                      className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <UserManage users={user} handleDeleteUser={handleDeleteUser} />
                )}
              </div>
            )}

            {/* Resource Management */}
            {activeSection === "resources" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Resource Management</h2>
                <ResourceManage />
              </div>
            )}

            {/* Subscription Management */}
            {activeSection === "subscriptions" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Management</h2>
                <SubscriptionManage />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Manage;