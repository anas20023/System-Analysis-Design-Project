import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-6">
            <h1 className="text-9xl font-bold text-slate-800">404</h1>
            <h2 className="mt-4 text-2xl font-semibold text-slate-700">
                Page Not Found
            </h2>
            <p className="mt-2 text-slate-500">
                Sorry, the page you’re looking for doesn’t exist or has been moved.
            </p>

            <Link
                to="/"
                className="mt-6 flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                <Home size={18} />
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
