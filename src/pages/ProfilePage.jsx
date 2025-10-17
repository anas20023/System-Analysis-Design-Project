import { useEffect, useState } from "react"
import Button from "../../components/button";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
    const navigate=new useNavigate();
    const [user, setUser] = useState({});
    const handleClick=()=>{
        navigate("/")
    }
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("userinfo")))
    }, [])
    return (
        <div className="min-h-screen flex-col bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden w-full max-w-md">
                {/* Profile Header with Image */}
                <div className="bg-blue-600 h-20 relative">
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        {user.profileImageLink ? (
                            <img
                                src={user.profileImageLink}
                                alt="Profile"
                                className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-gray-300 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-600">
                                    {user.fullName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-12 pb-6 px-6">
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
                        {user.fullName}
                    </h2>

                    <div className="space-y-3 mt-6">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 font-medium">Username:</span>
                            <span className="text-gray-900 font-semibold">{user.username}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 font-medium">Email:</span>
                            <span className="text-gray-900 font-semibold">{user.email}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600 font-medium">Full Name:</span>
                            <span className="text-gray-900 font-semibold">{user.fullName}</span>
                        </div>
                    </div>
                </div>
                <Button variant="destructive" onClick={handleClick} className="mx-auto my-2">
                    Back to Home
                </Button>
            </div>

        </div>
    );
}

export default ProfilePage
