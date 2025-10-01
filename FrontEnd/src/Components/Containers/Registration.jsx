import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import RegistrationPresenter from "../Presentation/RegistrationPresenter";
import Notification from "../../../components/toast"


const Registration = ({setNotification}) => {
    document.title = "Registration | CSE Resource Sharing Platform"
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showpwhash, setShowpwhash] = useState(false);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem("registrationData");
        return saved
            ? JSON.parse(saved)
            : { fullName: "", username: "", email: "", pwhash: "", profileImageLink: "" };
    });

    const userRef = useRef(userData);


    useEffect(() => {
        userRef.current = userData;
        localStorage.setItem("registrationData", JSON.stringify(userData));
    }, [userData]);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-z0-9]+$/;
    const pwhashRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const togglepwhashVisibility = () => setShowpwhash(!showpwhash);

    const handleChange = (field, value) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        //console.log("Submitting:", userRef.current);
        try {
            const res = await axios.post("http://localhost:8080/api/users", userData)
            if (res.status === 200) {
                // alert("Registration Successful ✅");
                localStorage.removeItem("registrationData");
                setIsLoading(false);
                setTimeout(() => {
                    navigate("/auth/login");
                }, 3000);
                 setNotification({
                type: "success",
                title: "Success!",
                message: "Account Created Successfully",
                duration: 3000
            });
            } else {
                throw new Error("Registration Failed ❌");
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <RegistrationPresenter userData={userData} usernameRegex={usernameRegex} isLoading={isLoading} pwhashRegex={pwhashRegex} emailRegex={emailRegex} showpwhash={showpwhash} step={step} setStep={setStep} handleSubmit={handleSubmit} handleChange={handleChange} handleNext={handleNext} togglepwhashVisibility={togglepwhashVisibility} />
    );
};

export default Registration;
