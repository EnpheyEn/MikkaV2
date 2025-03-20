import React, { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";

function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const userDataString = sessionStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const c_MB_ID = userData?.c_MB_ID || "Not found"; // ถ้าไม่มี c_MB_ID ให้แสดง "Not found"
  
  console.log("userData:", userData);
  console.log("c_MB_ID:", c_MB_ID);
  

  const token = sessionStorage.getItem("token");

  const [error, setError] = useState("");

  const images = ["/Promotion.jpg", "/Promotion1.jpg", "/Promotion2.jpg"];

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  
    if (!passwordRegex.test(passwords.new)) {
      setError("New password must be at least 8 characters and contain both uppercase and lowercase letters.");
      return;
    }
  
    if (passwords.new !== passwords.confirm) {
      setError("New Password and Confirm Password do not match.");
      return;
    }
  
    setError(""); // ล้างข้อผิดพลาดก่อนทำงานต่อ
  
    try {
      const response = await fetch("http://192.168.20.5/mk-member-api/api/Member/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ใช้ token ที่เก็บไว้ใน sessionStorage
        },
        body: JSON.stringify({
          c_MB_ID: c_MB_ID, // ส่ง c_MB_ID จาก userData
          oldPassword: passwords.old,
          newPassword: passwords.new,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update password");
  
      alert("Password updated successfully!");
      navigate("/Home");
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center p-6">
      {/* Header Section */}
      <div className="mt-16 p-3 sm:mt-12 w-full max-w-2xl">
        <ImageSlider images={images} />

        {/* Title */}
        <div className="flex items-center text-bg-MainColor font-medium justify-center text-lg mt-4">
          <h4>Reset Password</h4>
          <KeyRound color="#D51F39" className="ml-2" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full mt-6">
          {[
            { label: "Current Password", name: "old" },
            { label: "New Password", name: "new" },
            { label: "Confirm Password", name: "confirm" },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-bg-MainColor mb-1">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={showPassword[field.name] ? "text" : "password"}
                  name={field.name}
                  value={passwords[field.name]}
                  onChange={handleChange}
                  placeholder={`${field.label} *`}
                  className="w-full border rounded-lg p-2 pr-10 bg-white text-gray-700"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => togglePassword(field.name)}
                >
                  {showPassword[field.name] ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          ))}

          {/* Error Message */}
          {error && <p className="text-bg-MainColor text-sm">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button type="submit" className="bg-bg-MainColor text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600">
              Update
            </button>
            <button
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700"
              type="button"
              onClick={() => navigate("/Home")}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
