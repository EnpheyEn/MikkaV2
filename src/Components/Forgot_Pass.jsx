import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function ForgotPass() {
  const navigate = useNavigate(); 

  // เก็บค่าจากฟอร์ม
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // เก็บ OTP และเวลานับถอยหลัง
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // เวลาที่เหลือ (วินาที)

  // จัดการการเปลี่ยนแปลงของอินพุต
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ฟังก์ชันส่ง Code และเริ่มนับถอยหลัง 10 นาที (600 วินาที)
  const sendOtp = () => {
    if (!formData.email.includes('@')) {
      setErrors({ email: "Invalid email format!" });
      return;
    }
    
    // สร้าง Code (จำลองจาก JSON)
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    setOtpSent(true);
    setTimeLeft(600); // เริ่มนับ 10 นาที

    alert(`Your Code is: ${newOTP}`); // จำลองการส่ง OTP
  };

  // นับถอยหลังเวลาหมดอายุ Code
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setGeneratedOTP(null); // ล้าง Code เมื่อหมดเวลา
    }
  }, [timeLeft]);

  // ฟังก์ชันตรวจสอบข้อมูล
  const validateForm = () => {
    let newErrors = {};

    if (!formData.email.includes('@')) {
      newErrors.email = "Invalid email format!";
    }
    if (!otpSent) {
      newErrors.otp = "Please request an Code first!";
    } else if (generatedOTP === null) {
      newErrors.otp = "Code expired! Please request a new code.";
    } else if (formData.otp !== generatedOTP) {
      newErrors.otp = "Incorrect Code!";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ฟังก์ชันกดปุ่ม Confirm
  const handleConfirm = () => {
    if (validateForm()) {
      alert("Password successfully changed!");
      navigate("/");
    }
  };

  // แปลงเวลาเป็น mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className='bg-gray-100 text-bg-MainColor min-h-screen flex flex-col items-center p-6'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-10'>
        <h2 className='text-xl font-medium text-center mb-6'>Forget Password</h2>

        {/* Email */}
        <label className='mb-2'>Email</label>
        <input 
          type='email' 
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder='Email *' 
          className='w-full border border-gray-300 rounded-lg p-2 bg-white text-black' 
        />
        {errors.email && <p className="text-bg-MainColor text-sm">{errors.email}</p>}

        <button 
          className='w-full bg-bg-MainColor text-white py-2 rounded mt-4'
          onClick={sendOtp}
        >
          {otpSent ? "Resend Code" : "Send Code"}
        </button>

        {/* OTP */}
        <label className='block mt-4 mb-2 text-bg-MainColor'>OTP</label>
        <input 
          type='text' 
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          maxLength={6}
          placeholder='Code *' 
          className='w-full border border-gray-300 rounded-lg p-2 bg-white text-black' 
        />
        {errors.otp && <p className="text-bg-MainColor text-sm">{errors.otp}</p>}

        {/* แสดงเวลานับถอยหลัง */}
        {otpSent && generatedOTP !== null && (
          <p className="text-bg-MainColor text-sm mt-2 text-center">
            Code expires in {formatTime(timeLeft)}
          </p>
        )}

        {/* New Password */}
        <label className='block mt-4 mb-2 text-bg-MainColor'>New Password</label>
        <div className='relative mb-4'>
          <input 
            type={showPassword ? 'text' : 'password'} 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder='Password *' 
            className='w-full border border-gray-300 rounded-lg p-2 bg-white text-black' 
          />
        </div>
        {errors.password && <p className="text-bg-MainColor text-sm">{errors.password}</p>}

        {/* Confirm Password */}
        <label className='block mt-4 mb-2 text-bg-MainColor'>Confirm Password</label>
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
        {errors.confirmPassword && <p className="text-bg-MainColor text-sm">{errors.confirmPassword}</p>}

        {/* Buttons */}
        <div className='flex gap-4'>
          <button 
            className={`w-full text-white py-2 rounded ${generatedOTP === null ? "bg-gray-400 cursor-not-allowed" : "bg-bg-MainColor"}`} 
            onClick={handleConfirm}
            disabled={generatedOTP === null} // ป้องกันการกดเมื่อ Code หมดอายุ
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
