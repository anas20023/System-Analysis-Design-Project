
import { Mail, Lock, Check, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom"

const ForgetPresenter = ({ step, onhandleSendCode, email, setEmail, isLoading, onhandleResetPassword, code, setCode, showPassword, newPassword, setNewPassword, togglePasswordVisibility }) => {
    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 font-[archivo]">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                        <Lock className="w-6 h-6 text-gray-600" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Forgot Password
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {step === 1 && "Enter your email to receive a reset code"}
                        {step === 2 && "Enter the code & set a new password"}
                        {step === 3 && "Password reset successful!"}
                    </p>
                </div>

                {/* Step 1: Email input */}
                {step === 1 && (
                    <form onSubmit={onhandleSendCode} className="space-y-5">
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
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {isLoading ? "Sending..." : "Send Code"}
                        </button>
                    </form>
                )}

                {/* Step 2: Enter code + new password */}
                {step === 2 && (
                    <form onSubmit={onhandleResetPassword} className="space-y-5">
                        <div>
                            <label htmlFor="code" className="text-sm font-medium text-gray-900">
                                Verification Code
                            </label>
                            <input
                                id="code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter the code sent to your email"
                                className="w-full px-3 py-2 border rounded-md bg-transparent border-gray-300 focus:ring-2 focus:ring-gray-900 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="newPassword"
                                className="text-sm font-medium text-gray-900"
                            >
                                New Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pr-10 px-3 py-2 border rounded-md bg-transparent border-gray-300 focus:ring-2 focus:ring-gray-900 outline-none"
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
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !code || !newPassword}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center space-y-4">
                        <Check className="w-10 h-10 text-green-500 mx-auto" />
                        <h2 className="text-lg font-medium text-gray-900">
                            Your password has been reset 🎉
                        </h2>
                        <Link to="/auth/login">
                            <button
                                className="text-gray-900 font-medium hover:underline"
                            >
                                Sign In
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgetPresenter
