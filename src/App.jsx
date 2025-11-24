import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Login from "./Components/Containers/Login";
import Registration from "./Components/Containers/Registration";
import ForgotPassword from "./Components/Containers/ForgotPassword";
import ProfilePage from "./pages/ProfilePage";
import Manage from "./pages/Manage";
import Upload from "./Components/Containers/UploadSection";
import { useState, useEffect } from "react";
import Notification from "../components/toast";
import { isTokenValid, removeToken } from "./utils/auth";
import EditProfile from "./Components/Containers/EditProfile";
import Resources from "./Components/Containers/Resources";

// --- Protected Route wrapper ---
const ProtectedRoute = ({ children }) => {
  if (!isTokenValid()) {
    removeToken(); // just in case
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

// --- Public Route wrapper (redirect if already logged in) ---
const PublicRoute = ({ children }) => {
  if (isTokenValid()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [notification, setNotification] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTokenValid()) {
        if (isAuthenticated) {
          setNotification({
            type: "error",
            title: "Session Expired",
            message: "Please log in again.",
            duration: 3000,
          });
        }
        setIsAuthenticated(false);
        removeToken();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          showIcon={true}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<Resources />} />

          {/* Public routes */}
          <Route
            path="/auth/login"
            element={
              <PublicRoute>
                <Login setNotification={setNotification} />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <PublicRoute>
                <Registration setNotification={setNotification} />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/forgot"
            element={
              <PublicRoute>
                <ForgotPassword setNotification={setNotification} />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload setNotification={setNotification} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage"
            element={
              <ProtectedRoute>
                <Manage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
