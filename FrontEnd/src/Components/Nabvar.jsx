import { Menu, X, ArrowRight, Upload, Download, Fingerprint, BookOpen } from "lucide-react";
import Button from "../../components/button";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="flex justify-center items-center w-full bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b border-slate-700">
      <nav className="max-w-6xl w-full px-6 py-4 flex items-center justify-between">
        <Link to="/auth/login">
          <Button className="bg-green-500 dark:bg-green-500 dark:text-white dark:hover:bg-green-800" variant="default" iconLeft={<Fingerprint />}>
            Login
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;