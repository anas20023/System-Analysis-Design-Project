import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Login from "./Components/Login";
import Registration from "./Components/Containers/Registration";
import ForgotPassword from "./Components/ForgotPassword";
import { useState } from "react";
import Notification from "../components/toast";

function App() {
  const [notification, setNotification] = useState(null);

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
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<Login setNotification={setNotification} />} />

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
