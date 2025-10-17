import { useState } from "react";
import ForgetPresenter from "../Presentation/ForgetPresenter";
import axios from 'axios'

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const url=import.meta.env.VITE_SERVER;

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSendCode = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
           const res=await axios.post(`${url}/users/forgot`,{email:email})
           alert(res.data);
           setStep(2);
        } catch (error) {
            alert(error.response.data);
            setIsLoading(false);
            setEmail("");
        }
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
           //APi Route Will Apear Here 
        } catch (error) {
            console.log(error);
        }finally{
            setStep(3);
        }
    };

    return (
        <ForgetPresenter step={step} onhandleSendCode={handleSendCode} email={email} setEmail={setEmail} isLoading={isLoading} onhandleResetPassword={handleResetPassword} code={code} setCode={setCode} showPassword={showPassword} newPassword={newPassword} setNewPassword={setNewPassword} togglePasswordVisibility={togglePasswordVisibility} />
    );
};

export default ForgotPassword;
