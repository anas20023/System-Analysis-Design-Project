import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Edit3,
    Mail,
    User,
    Calendar,
    BookOpen,
    Download,
    Upload,
    Star,
    Settings,
    LogOut,
    Loader2,
    FileText,
    CheckCircle,
    Clock,
    Eye
} from "lucide-react";
import Button from "../../components/button";
import { removeToken } from "../utils/auth";
import axios from "axios";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);

    const handleBackClick = () => {
        navigate("/");
    };

    const handleLogout = () => {
        removeToken()
        navigate("/");
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const authToken = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('authToken='))
                    ?.split('=')[1];

                const res = await axios.get(`${import.meta.env.VITE_SERVER}/users/me`, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
                    }
                });

                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user:", error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    navigate("/auth/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // Calculate stats from actual data
    const userStats = {
        resourcesUploaded: user.resources?.length || 0,
        approvedResources: user.resources?.filter(r => r.status === "APPROVED").length || 0,
        pendingResources: user.resources?.filter(r => r.status === "PENDING").length || 0,
        downloads: user.resources?.reduce((total, resource) => total + (resource.downloadCount || 0), 0) || 0
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format relative time
    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return formatDate(dateString);
    };

    // Get status color and icon
    const getStatusInfo = (status) => {
        switch (status) {
            case "APPROVED":
                return { color: "text-green-600", bg: "bg-green-100", icon: CheckCircle };
            case "PENDING":
                return { color: "text-yellow-600", bg: "bg-yellow-100", icon: Clock };
            default:
                return { color: "text-gray-600", bg: "bg-gray-100", icon: Clock };
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-slate-800 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-800 font-[archivo]">Loading Profile...</h2>
                    <p className="text-slate-600 mt-2">Please wait while we load your information</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            {/* Header */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Home
                    </button>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="flex items-center"
                        >
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                            {/* Profile Header */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block mb-4">
                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full border-4 border-slate-100 shadow-md object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full border-4 border-slate-100 shadow-md bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>

                                <h2 className="text-xl font-bold text-slate-800 font-[archivo] mb-1">
                                    {user.name || 'User Name'}
                                </h2>
                                <p className="text-slate-600 text-sm">@{user.username}</p>
                                <p className="text-slate-500 text-xs mt-1">Member since {formatDate(user.joinedDate)}</p>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Upload size={16} className="text-slate-600 mr-2" />
                                        <span className="text-sm text-slate-600">Total Uploads</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{userStats.resourcesUploaded}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center">
                                        <CheckCircle size={16} className="text-green-600 mr-2" />
                                        <span className="text-sm text-slate-600">Approved</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{userStats.approvedResources}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Clock size={16} className="text-yellow-600 mr-2" />
                                        <span className="text-sm text-slate-600">Pending</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{userStats.pendingResources}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Download size={16} className="text-slate-600 mr-2" />
                                        <span className="text-sm text-slate-600">Downloads</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{userStats.downloads}</span>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="space-y-1">
                                {[
                                    { id: 'profile', label: 'Profile Info', icon: User },
                                    { id: 'resources', label: 'My Resources', icon: BookOpen },
                                    { id: 'settings', label: 'Settings', icon: Settings }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-slate-800 text-white shadow-md'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                            }`}
                                    >
                                        <tab.icon size={18} className="mr-3" />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-2xl font-bold text-slate-800 font-[archivo] mb-6">
                                    Profile Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl">
                                            <h4 className="font-semibold text-slate-700 mb-4 flex items-center">
                                                <User size={18} className="mr-2 text-slate-600" />
                                                Personal Information
                                            </h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm text-slate-500">Full Name</label>
                                                    <p className="font-semibold text-slate-800">{user.name}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm text-slate-500">Username</label>
                                                    <p className="font-semibold text-slate-800">@{user.username}</p>
                                                </div>
                                                {/* <div>
                                                    <label className="text-sm text-slate-500">User ID</label>
                                                    <p className="font-semibold text-slate-800">#{user.id}</p>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl">
                                            <h4 className="font-semibold text-slate-700 mb-4 flex items-center">
                                                <Mail size={18} className="mr-2 text-slate-600" />
                                                Contact Information
                                            </h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm text-slate-500">Email Address</label>
                                                    <p className="font-semibold text-slate-800">{user.email}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm text-slate-500">Member Since</label>
                                                    <p className="font-semibold text-slate-800">
                                                        {formatDate(user.joinedDate)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Summary */}
                                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                                    <h4 className="font-semibold text-slate-700 mb-4">Account Summary</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-blue-900">{userStats.resourcesUploaded}</div>
                                            <div className="text-sm text-blue-700">Total Uploads</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-green-900">{userStats.approvedResources}</div>
                                            <div className="text-sm text-green-700">Approved</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-yellow-900">{userStats.pendingResources}</div>
                                            <div className="text-sm text-yellow-700">Pending</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-purple-900">
                                                {userStats.resourcesUploaded > 0 
                                                    ? Math.round((userStats.approvedResources / userStats.resourcesUploaded) * 100)
                                                    : 0
                                                }%
                                            </div>
                                            <div className="text-sm text-purple-700">Approval Rate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'resources' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-2xl font-bold text-slate-800 font-[archivo] mb-6">
                                    My Resources
                                </h3>

                                {user.resources?.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FileText size={64} className="mx-auto text-slate-400 mb-4" />
                                        <h4 className="text-xl font-semibold text-slate-600 mb-2">No Resources Yet</h4>
                                        <p className="text-slate-500 mb-6">You haven't uploaded any resources yet.</p>
                                        <Button 
                                            onClick={() => navigate("/upload")}
                                            className="flex items-center mx-auto"
                                        >
                                            <Upload size={16} className="mr-2" />
                                            Upload Your First Resource
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {user.resources?.map((resource) => {
                                            const StatusIcon = getStatusInfo(resource.status).icon;
                                            const statusColor = getStatusInfo(resource.status).color;
                                            const statusBg = getStatusInfo(resource.status).bg;
                                            
                                            return (
                                                <div key={resource.id} className="flex items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                                                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mr-4">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-slate-800 truncate">{resource.title}</h4>
                                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{resource.description}</p>
                                                        <div className="flex items-center mt-2 space-x-4 text-xs text-slate-500">
                                                            <span className="flex items-center">
                                                                <Calendar size={12} className="mr-1" />
                                                                {formatDate(resource.createdAt)}
                                                            </span>
                                                            {resource.approvedAt && (
                                                                <span className="flex items-center">
                                                                    <CheckCircle size={12} className="mr-1" />
                                                                    Approved {formatRelativeTime(resource.approvedAt)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                                                            <StatusIcon size={12} className="mr-1" />
                                                            {resource.status}
                                                        </span>
                                                        <a
                                                            href={resource.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
                                                        >
                                                            <Eye size={16} />
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {user.resources?.length > 0 && (
                                    <div className="mt-6 text-center">
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => navigate("/upload")}
                                            className="w-full max-w-xs"
                                        >
                                            <Upload size={16} className="mr-2" />
                                            Upload More Resources
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-2xl font-bold text-slate-800 font-[archivo] mb-6">
                                    Account Settings
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-50 rounded-xl">
                                        <h4 className="font-semibold text-slate-700 mb-4">Privacy Settings</h4>
                                        <p className="text-slate-600 mb-4">Control who can see your activity and profile information.</p>
                                        <Button variant="secondary">Manage Privacy</Button>
                                    </div>

                                    <div className="p-6 bg-slate-50 rounded-xl">
                                        <h4 className="font-semibold text-slate-700 mb-4">Notification Preferences</h4>
                                        <p className="text-slate-600 mb-4">Choose how you want to be notified about platform updates.</p>
                                        <Button variant="secondary">Configure Notifications</Button>
                                    </div>

                                    <div className="p-6 bg-red-50 rounded-xl">
                                        <h4 className="font-semibold text-red-700 mb-4">Danger Zone</h4>
                                        <p className="text-red-600 mb-4">Permanently delete your account and all associated data.</p>
                                        <Button variant="destructive">Delete Account</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;