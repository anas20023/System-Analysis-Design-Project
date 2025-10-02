import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = ({ setNotification }) => {
    document.title = "Login | CSE Resource Sharing Platform";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post("http://localhost:8080/api/users/login", {
                email,
                password,
            });

            console.log(res);

            setNotification({
                type: "success",
                title: "Success!",
                message: e.response?.data?.message,
                duration: 3000,
            });
            setEmail('')
            setPassword('')
        } catch (e) {
            console.log(e);
            setNotification({
                type: "error",
                title: "Login Failed!",
                message: e.response?.data?.error || "Something went wrong. Try again.",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                        <Lock className="w-6 h-6 text-gray-600" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
                    <p className="text-sm text-gray-600 mt-1">Enter your credentials to sign in</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-900">
                            Email
                        </label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-9 pr-3 py-2 border rounded-md bg-transparent border-gray-300 focus:ring-2 focus:ring-gray-900 outline-none"
                                required
                            />
                        </div>
                        {email && !emailRegex.test(email) && (
                            <p className="text-xs text-red-500 mt-1">Enter a valid email address</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-sm font-medium text-gray-900">
                                Password
                            </label>
                            <Link to="/auth/forgot">
                                <p className="text-gray-900 text-sm hover:underline">Forgot Password?</p>
                            </Link>
                        </div>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full pl-9 pr-10 py-2 border rounded-md bg-transparent border-gray-300 focus:ring-2 focus:ring-gray-900 outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {password && password.length < 8 && (
                            <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!emailRegex.test(email) || !password || password.length < 8}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link to="/auth/signup">
                            <button className="text-gray-900 font-medium hover:underline">Sign up</button>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
