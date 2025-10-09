import { useState } from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";
import { saveToken } from "../../utils/auth";
import LoginPresenter from "../Presentation/LoginPresenter";



const Login = ({ setNotification }) => {
    const navigate = useNavigate();
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
            const res = await axios.post(`${import.meta.env.VITE_SERVER}/users/login`, {
                email,
                password,
            });

            const token = res.data?.token;
            if (token) {
                saveToken(token);
            }
            console.log(res.data?.user);
            setNotification({
                type: "success",
                title: "Success!",
                message: res.data?.message || "Login successful!",
                duration: 3000,
            });
            navigate("/");
            setEmail("");
            setPassword("");
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
        <LoginPresenter onhandleSubmit={handleSubmit} email={email} setEmail={setEmail} emailRegex={emailRegex} password={password} setPassword={setPassword} showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} isLoading={isLoading} />
    );
};

export default Login;
