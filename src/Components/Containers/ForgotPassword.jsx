import { useState, useEffect } from "react";
import ForgetPresenter from "../Presentation/ForgetPresenter";
import axios from "axios";

const ForgotPassword = ({ setNotification }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const url = import.meta.env.VITE_SERVER;

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // Disable back button and page reload
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (step > 1) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        // eslint-disable-next-line no-unused-vars
        const handlePopState = (e) => {
            if (step > 1) {
                window.history.pushState(null, "", window.location.href);
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [step]);

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const res = await axios.post(`${url}/users/forgot`, { email });
            setNotification({
                type: "success",
                title: "Success!",
                message: res.data,
                duration: 3000,
            });
            setStep(2);
        } catch (error) {
            setNotification({
                type: "error",
                title: "Something went wrong!",
                message: error.response?.data || "Server Error",
                duration: 3000,
            });
            setEmail("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!code || !newPassword) return;

        setIsLoading(true);
        try {
            const res = await axios.post(`${url}/users/newpassword`, { email, otp: code, newPassword });
            setNotification({
                type: "success",
                title: "Password Reset!",
                message: res.data,
                duration: 3000,
            });
            setStep(3);
        } catch (error) {
            setNotification({
                type: "error",
                title: "Failed to reset password!",
                message: error.response?.data || "Server Error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ForgetPresenter
            step={step}
            onhandleSendCode={handleSendCode}
            email={email}
            setEmail={setEmail}
            isLoading={isLoading}
            onhandleResetPassword={handleResetPassword}
            code={code}
            setCode={setCode}
            showPassword={showPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            togglePasswordVisibility={togglePasswordVisibility}
        />
    );
};

export default ForgotPassword;
