import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Login from "./Components/Containers/Login";
import Registration from "./Components/Containers/Registration";
import ForgotPassword from "./Components/Containers/ForgotPassword";
import { useState, useEffect } from "react";
import Notification from "../components/toast";
import { isTokenValid, removeToken } from "./utils/auth";

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
  });

  return (
    <>
      {/* Notification */}
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

      {/* Routes */}
      <Router>
        <Routes>
          {/* If token valid → show Home, else → Login */}
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/"
            element={!isAuthenticated && <Login setNotification={setNotification} />}
          />
          <Route
            path="/auth/login"
            element={<Login setNotification={setNotification} />}
          />

          <Route
            path="/auth/signup"
            element={<Registration setNotification={setNotification} />}
          />

          <Route path="/auth/forgot" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
