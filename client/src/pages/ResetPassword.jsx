import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { set } from "mongoose";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const inputRefs = React.useRef([]);

  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [OTP, setOTP] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

  ////////////////

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

  //////////

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/auth/send-reset-otp`, {
        email,
      });
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        `Something went wrong, please try again later.${error.message}`
      );
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map((e) => e.value);
    setOTP(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/auth/reset-password`, {
        email,
        OTP,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0  bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* enter email id */}

      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          action=""
        >
          <h1 className="text-2xl font-semibold text-center text-white mb-4">
            Reset Password
          </h1>
          <p className="text-center text-indigo-300 mb-6">
            Enter your registered Email Address
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-2.5 mt-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer ">
            Submit
          </button>
        </form>
      )}

      {/* otp input form */}

      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={onSubmitOTP}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          action=""
        >
          <h1 className="text-2xl font-semibold text-center text-white mb-4">
            Reset Password OTP
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
            // disabled={isVerifying}
            className="w-full py-2.5 mt-4 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer "
          >
            {/* {isVerifying ? "Verifying..." : "Verify Email"} */}Submit
          </button>
        </form>
      )}
      {/* enter new password */}

      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          action=""
        >
          <h1 className="text-2xl font-semibold text-center text-white mb-4">
            New Password
          </h1>
          <p className="text-center text-indigo-300 mb-6">
            Enter your new password
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-2.5 mt-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer ">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
