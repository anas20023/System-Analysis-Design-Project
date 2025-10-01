import { useState, useEffect, useRef } from "react";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Check,
    ArrowRight,
    ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios"
const Registration = () => {
    document.title = "Registration | CSE Resource Sharing Platform"
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showpwhash, setShowpwhash] = useState(false);

    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem("registrationData");
        return saved
            ? JSON.parse(saved)
            : { fullName: "", userName: "", email: "", pwhash: "", profileImageLink: "" };
    });

    const userRef = useRef(userData);


    useEffect(() => {
        userRef.current = userData;
        localStorage.setItem("registrationData", JSON.stringify(userData));
    }, [userData]);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-z0-9]+$/;
    const pwhashRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const togglepwhashVisibility = () => setShowpwhash(!showpwhash);

    const handleChange = (field, value) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        //console.log("Submitting:", userRef.current);
        try {
            const res = axios.post("http://localhost:8080/api/users")
            if (res.status === 200) {
                alert("Success")
                setTimeout(() => {
                    setIsLoading(false);
                    localStorage.removeItem("registrationData"); // clear after success
                }, 2000);
            }
            else {
                throw "Failed"
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">
                            Step {step} of 3
                        </span>
                        <span className="text-sm text-gray-500">
                            {Math.round((step / 3) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gray-900 h-2 rounded-full transition-all"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="text-sm font-medium text-gray-900"
                                >
                                    Full Name
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={userData.fullName}
                                        onChange={(e) => handleChange("fullName", e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full px-3 py-2 border rounded-md bg-transparent border-gray-300 focus:ring-2 focus:ring-gray-900 outline-none"
                                    />
                                    {userData.fullName && (
                                        <Check className="absolute right-3 top-2.5 w-4 h-4 text-green-500" />
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="userName"
                                    className="text-sm font-medium text-gray-900"
                                >
                                    Username
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="userName"
                                        type="text"
                                        value={userData.userName}
                                        onChange={(e) => handleChange("userName", e.target.value)}
                                        placeholder="Enter your username"
                                        className={`w-full px-3 py-2 border rounded-md bg-transparent outline-none ${userData.userName &&
                                            !usernameRegex.test(userData.userName)
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-2 focus:ring-gray-900"
                                            }`}
                                    />
                                    {userData.userName && usernameRegex.test(userData.userName) && (
                                        <Check className="absolute right-3 top-2.5 w-4 h-4 text-green-500" />
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={
                                    !userData.fullName ||
                                    !userData.userName ||
                                    userData.userName.length <= 5 ||
                                    !usernameRegex.test(userData.userName)
                                }
                                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                Next Step <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-900"
                                >
                                    Email
                                </label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        placeholder="name@example.com"
                                        className={`w-full pl-9 pr-3 py-2 border rounded-md bg-transparent outline-none ${userData.email && !emailRegex.test(userData.email)
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-2 focus:ring-gray-900"
                                            }`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="Password"
                                    className="text-sm font-medium text-gray-900"
                                >
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        id="pwhash"
                                        type={showpwhash ? "text" : "password"}
                                        value={userData.pwhash}
                                        onChange={(e) => handleChange("pwhash", e.target.value)}
                                        placeholder="Create a Password"
                                        className={`w-full pl-9 pr-10 py-2 border rounded-md bg-transparent outline-none ${userData.pwhash && !pwhashRegex.test(userData.pwhash)
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-2 focus:ring-gray-900"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglepwhashVisibility}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showpwhash ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {userData.pwhash && !pwhashRegex.test(userData.pwhash) && (
                                    <p className="text-xs text-red-500 mt-1">
                                        pwhash must be 8+ chars, include uppercase, lowercase,
                                        number, and special character
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={
                                    !emailRegex.test(userData.email) ||
                                    !pwhashRegex.test(userData.pwhash)
                                }
                                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                Next Step <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" /> Review Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Username:</span>
                                        <span className="font-medium">{userData.userName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-medium">{userData.fullName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium">{userData.email}</span>
                                    </div>

                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </div>
                    )}
                </form>

                {/* Back Button */}
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="mt-4 w-full text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to previous step
                    </button>
                )}

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/auth/login">
                            <button className="text-gray-900 font-medium hover:underline">
                                Sign In
                            </button>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;
