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
    Loader2
} from "lucide-react";
import Button from "../../components/button";
import axios from "axios";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    const handleBackClick = () => {
        navigate("/");
    };

    const handleEditProfile = () => {
        // Navigate to edit profile page
        console.log("Edit profile clicked");
    };

    const handleLogout = () => {
        localStorage.removeItem("userinfo");
        navigate("/auth/login");
    };

    // Mock user stats - you can replace this with actual API call
    const userStats = {
        resourcesUploaded: 12,
        downloads: 245,
        rating: 4.8,
        joinedDate: "2024-01-15"
    };

    // Mock recent activity
    const recentActivity = [
        { type: 'upload', title: 'Data Structures Notes', date: '2 hours ago' },
        { type: 'download', title: 'Machine Learning Guide', date: '1 day ago' },
        { type: 'upload', title: 'Database Design Patterns', date: '3 days ago' },
        { type: 'download', title: 'Web Development Roadmap', date: '1 week ago' }
    ];

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
                // Simulate stats loading
                setTimeout(() => {
                    setStatsLoading(false);
                }, 1000);
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
                            variant="secondary"
                            onClick={handleEditProfile}
                            className="flex items-center"
                        >
                            <Edit3 size={16} className="mr-2" />
                            Edit Profile
                        </Button>
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
                                <p className="text-slate-600 text-sm">@{user.username || 'username'}</p>

                                <div className="flex items-center justify-center mt-2 text-slate-500">
                                    <Star size={14} className="mr-1 text-yellow-500 fill-current" />
                                    <span className="text-sm font-medium">{userStats.rating}</span>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-4 mb-6">
                                {statsLoading ? (
                                    // Loading state for stats
                                    <>
                                        {[1, 2, 3].map((item) => (
                                            <div key={item} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 bg-slate-200 rounded mr-2 animate-pulse"></div>
                                                    <div className="w-16 h-4 bg-slate-200 rounded animate-pulse"></div>
                                                </div>
                                                <div className="w-8 h-4 bg-slate-200 rounded animate-pulse"></div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    // Loaded stats
                                    <>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center">
                                                <Upload size={16} className="text-slate-600 mr-2" />
                                                <span className="text-sm text-slate-600">Uploads</span>
                                            </div>
                                            <span className="font-bold text-slate-800">{userStats.resourcesUploaded}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center">
                                                <Download size={16} className="text-slate-600 mr-2" />
                                                <span className="text-sm text-slate-600">Downloads</span>
                                            </div>
                                            <span className="font-bold text-slate-800">{userStats.downloads}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center">
                                                <Calendar size={16} className="text-slate-600 mr-2" />
                                                <span className="text-sm text-slate-600">Joined</span>
                                            </div>
                                            <span className="font-bold text-slate-800 text-sm">
                                                {user.joinedDate ? 
                                                    new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 
                                                    new Date(userStats.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                                }
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Navigation Tabs */}
                            <div className="space-y-1">
                                {[
                                    { id: 'profile', label: 'Profile Info', icon: User },
                                    { id: 'activity', label: 'Recent Activity', icon: BookOpen },
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

                                {statsLoading ? (
                                    // Loading state for profile content
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[1, 2].map((item) => (
                                                <div key={item} className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl">
                                                    <div className="flex items-center mb-4">
                                                        <div className="w-6 h-6 bg-slate-200 rounded-full mr-2 animate-pulse"></div>
                                                        <div className="w-32 h-4 bg-slate-200 rounded animate-pulse"></div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {[1, 2].map((field) => (
                                                            <div key={field}>
                                                                <div className="w-20 h-3 bg-slate-200 rounded mb-2 animate-pulse"></div>
                                                                <div className="w-full h-4 bg-slate-200 rounded animate-pulse"></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                                            <div className="w-24 h-4 bg-blue-200 rounded mb-4 animate-pulse"></div>
                                            <div className="space-y-2">
                                                <div className="w-full h-3 bg-blue-200 rounded animate-pulse"></div>
                                                <div className="w-3/4 h-3 bg-blue-200 rounded animate-pulse"></div>
                                                <div className="w-1/2 h-3 bg-blue-200 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Loaded profile content
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
                                                        <p className="font-semibold text-slate-800">{user.name || 'Not provided'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-slate-500">Username</label>
                                                        <p className="font-semibold text-slate-800">@{user.username || 'Not provided'}</p>
                                                    </div>
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
                                                        <p className="font-semibold text-slate-800">{user.email || 'Not provided'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-slate-500">Member Since</label>
                                                        <p className="font-semibold text-slate-800">
                                                            {user.joinedDate ? 
                                                                new Date(user.joinedDate).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                }) : 
                                                                new Date(userStats.joinedDate).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Additional Info Section */}
                                {!statsLoading && (
                                    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                                        <h4 className="font-semibold text-slate-700 mb-4">About Me</h4>
                                        <p className="text-slate-600 leading-relaxed">
                                            {user.bio || "Passionate computer science student dedicated to sharing knowledge and resources with the community. Always looking for new learning opportunities and ways to contribute to the platform."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Other tabs remain the same */}
                        {activeTab === 'activity' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-2xl font-bold text-slate-800 font-[archivo] mb-6">
                                    Recent Activity
                                </h3>

                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${activity.type === 'upload'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {activity.type === 'upload' ? <Upload size={18} /> : <Download size={18} />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-800">{activity.title}</h4>
                                                <p className="text-sm text-slate-500">{activity.date}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.type === 'upload'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {activity.type === 'upload' ? 'Uploaded' : 'Downloaded'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 text-center">
                                    <Button variant="secondary" className="w-full max-w-xs">
                                        View All Activity
                                    </Button>
                                </div>
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