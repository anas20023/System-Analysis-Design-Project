import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import ForgotPassword from "./Components/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />
        {/* Auth */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Registration />} />
        <Route path="/auth/forgot" element={<ForgotPassword />} />
        {/* Catch-all (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
