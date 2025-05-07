import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function ForgotPass() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับการโหลด

  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    // โหลด config จากไฟล์ public/config.js
    fetch('/config.js')
      .then((response) => response.text())
      .then((data) => {
        eval(data); // Run the config.js code
        setConfigData(window.env); // เก็บข้อมูลที่ได้จาก config.js
      })
      .catch((error) => {
        console.error("Error loading config:", error);
      });
  }, []);

  useEffect(() => {
    if (configData) {
      // สามารถใช้งาน configData ที่โหลดมาจาก public/config.js
      console.log(configData);
    }
  }, [configData]);

  const handleConfirm = async () => {
    if (!validateFormInputs()) return;

    setLoading(true);
    try {
      const response = await fetch(`${window.env.API_BASE_URL}/Member/verify-reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
          tel: ""
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP! Please try again.");
      }

      alert("Password successfully changed!");
      navigate("/");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors({ otp: error.message || "OTP verification failed!" });
    } finally {
      setLoading(false);
    }
  };


  const validateFormInputs = () => {
    let newErrors = {};

    if (!formData.email.includes('@')) {
      newErrors.email = "Invalid email format!";
    }
    if (!formData.otp) {
      newErrors.otp = "Please enter OTP!";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      newErrors.password = "Password must be at least 8 characters and include uppercase & lowercase letters!";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendOtp = async () => {
    if (!formData.email.includes('@')) {
      setErrors({ email: "Invalid email format!" });
      return;
    }

    setLoading(true); // เริ่มโหลด
    try {
      const ipResponse = await fetch("https://api64.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const userIP = ipData.ip;

      const response = await fetch(`${window.env.API_BASE_URL}/Member/send-otp-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IP: userIP,
          Email: formData.email,
          Tel: "",
          c_MB_ID: null,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to send OTP!");

      setGeneratedOTP(data.otp);
      setOtpSent(true);
      setTimeLeft(600);

      alert("OTP has been sent to your email.");
    } catch (error) {
      alert(error.message || "An error occurred while sending OTP.");
    } finally {
      setLoading(false); // หยุดโหลด
    }
  };


  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setGeneratedOTP(null);
    }
  }, [timeLeft]);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.email.includes('@')) {
      newErrors.email = "Invalid email format!";
    }
    if (!otpSent) {
      newErrors.otp = "Please request a Code first!";
    } else if (generatedOTP === null) {
      newErrors.otp = "Code expired! Please request a new code.";
    } else if (formData.otp !== generatedOTP) {
      newErrors.otp = "Incorrect Code!";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      newErrors.password = "Password must be at least 8 characters and include uppercase & lowercase letters!";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    setErrors(newErrors);
    console.log("Validation Errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-[url('/BGMikka1.png')] bg-cover bg-center">
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-10'>
        <h2 className='text-xl font-medium text-center mb-6 text-bg-MainColor'>Forget Password</h2>
        <div className="flex">
        <label className='mb-2 text-bg-MainColor'>Email *</label>
        <label className="block text-xs text-slate-500 mt-2">(อีเมล์)</label>
        </div>
        <input
          type='email'
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder='Email *'
          className='w-full border border-gray-300 rounded-lg p-2 bg-white text-black'
        />
        {errors.email && <p className="text-bg-MainColor text-sm text-center m-2">{errors.email}</p>}

        <button
          className='w-full bg-bg-MainColor text-white py-2 rounded mt-4 disabled:opacity-50'
          onClick={sendOtp}
          disabled={loading}
        >
          {loading ? "Sending..." : (otpSent ? "Resend Code" : "Send Code")}
        </button>


        <label className='block mt-4 mb-2 text-bg-MainColor'>OTP *</label>
        <input
          type='text'
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          maxLength={6}
          placeholder='Code *'
          className='w-full border border-gray-300 rounded-lg p-2 bg-white text-black'
        />
        {errors.otp && <p className="text-bg-MainColor text-sm  m-2">{errors.otp}</p>}

        {otpSent && generatedOTP !== null && (
          <p className="text-bg-MainColor text-sm mt-2 text-center">
            Code expires in {formatTime(timeLeft)}
          </p>
        )}
        <div className="flex">
        <label className='block mt-4 mb-2 text-bg-MainColor'>New Password *</label>
        <label className="block text-xs text-slate-500 mt-6">(รหัสผ่านใหม่)</label>
        </div>
        <div className='relative mb-4'>
          <input
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder='Password *'
            className='w-full border border-gray-300 rounded-lg p-2 bg-white text-black'
          />
        </div>

        <div className="flex">
        <label className='block mt-4 mb-2 text-bg-MainColor'>Confirm Password *</label>
        <label className="block text-xs text-slate-500 mt-6">(ยืนยันรหัสผ่าน)</label>
        </div>
        <div className='relative mb-4'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='Confirm Password *'
            className='w-full border border-gray-300 rounded-lg p-2 bg-white text-black'
          />
        </div>
        {errors.confirmPassword && <p className="text-bg-MainColor text-sm text-center m-2">{errors.confirmPassword}</p>}
        {errors.password && <p className="text-bg-MainColor text-sm text-center m-2">{errors.password}</p>}
        <div className='flex gap-4'>
          <button
            className={`w-full text-white py-2 rounded ${generatedOTP === null ? "bg-gray-400 cursor-not-allowed" : "bg-bg-MainColor"}`}
            onClick={handleConfirm}
            disabled={!otpSent}
          >
            Confirm
          </button>

          <button
            className='w-full bg-gray-400 text-white py-2 rounded'
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPass;
