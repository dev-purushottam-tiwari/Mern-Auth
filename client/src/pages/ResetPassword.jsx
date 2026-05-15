import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";

export const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef(new Array(6).fill(null));

  const handleInput = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) {
      e.target.value = "";
      return;
    }

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasteData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasteData)) return;

    const pasteArray = pasteData.slice(0, 6).split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    const nextIndex = pasteArray.length - 1;
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email },
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value);
    const otp = otpArray.join("");
    setOtp(otp)
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const {data} =await axios.post(backendUrl+'/api/auth/reset-password',{email,newPassword,otp});
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      toast.error(error.message);
      
    }
  }
    

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-smeibold text-center mb-4">
            Reset password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-3 h-3 " />
            <input
              type="email"
              name=""
              id=""
              placeholder="Email id"
              className="text-white bg-transparent outline-none w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Email Verify OTP
          </h1>

          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email
          </p>

          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {inputRefs.current.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                inputMode="numeric"
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r text-white from-indigo-500 to-indigo-900 rounded-full">
            Verify
          </button>
        </form>
      )}
      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-smeibold text-center mb-4">
            New password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new password
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-3 h-3 " />
            <input
              type="password"
              name=""
              id=""
              placeholder="New password"
              className="text-white bg-transparent outline-none w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};


export default ResetPassword;
