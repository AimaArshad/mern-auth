import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const EmailVerify = () => {
  axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);
  const navigate = useNavigate();

  const inputRefs = React.useRef([]);

  const [isVerifying, setIsVerifying] = useState(false);

  const [otpValues, setOtpValues] = useState(Array(6).fill("")); // Track OTP values in state

  const handleInput = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      e.target.value = otpValues[index]; // Reset to previous value
      return;
    }

    // Update the OTP values in state
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  //delete the input field number using backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("").slice(0, 6);
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index] && /^\d$/.test(char)) {
        inputRefs.current[index].value = char;
        // inputRefs.current[index].dispatchEvent(new Event("input"));

        const newOtpValues = [...otpValues];
        newOtpValues[index] = char;
        setOtpValues(newOtpValues);
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const otpArray = inputRefs.current.map((input) => input.value);
      const OTP = otpArray.join("");

      console.log("Verifying OTP:", OTP);

      const { data } = await axios.post(`${backendUrl}/auth/verify-email`, {
        OTP,
      });

      if (data.success) {
        toast.success(data.message);
        await getUserData();
        console.log(userData);
        // userData.isAccountVerified = true;
        navigate("/");
      } else {
        console.log(userData);
        console.log(data, "data");
        toast.error(data.message);

        // Clear OTP fields on failure
        inputRefs.current.forEach((input) => (input.value = ""));
        setOtpValues(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Error verifying email:", error.message);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        action=""
      >
        <h1 className="text-2xl font-semibold text-center text-white mb-4">
          Email Verification OTP
        </h1>
        <p className="text-center text-indigo-300 mb-6">
          Enter the 6-digit Code sent to your email address.
        </p>

        <div onClick={handlePaste} className="flex justify-between mb-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center  text-xl rounded-md outline-none"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer "
        >
          {isVerifying ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
