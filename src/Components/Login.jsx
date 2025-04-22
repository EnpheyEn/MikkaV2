import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Components/APIManage/api"
// import { useEffect } from "react";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับการโหลด
     const [configData, setConfigData] = useState(null);
    useEffect(() => {
        // โหลด config จากไฟล์ public/config.js
        fetch('/config.js')
          .then((response) => response.text())
          .then((data) => {
            eval(data); // Run the config.js code
            setConfigData(window.env); // เก็บข้อมูลที่ได้จาก config.js
            console.log("Noey Log : "+ window.env.API_BASE_URL);
          })
          .catch((error) => {
            console.error("Error loading config:", error);
          });
      }, []);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true); // เริ่มการโหลด
        try {
           
            const response = await login(window.env.API_BASE_URL,username, password);
            console.log("API Response:", response);

            if (response.isSuccess) {
                console.log("Saved User Data:", response.data);
                sessionStorage.setItem("userData", JSON.stringify(response.data));
                sessionStorage.setItem("isLoggedIn", "true");
                navigate("/Home"); // ✅ เข้า Home ถ้า Login สำเร็จ
            } else {
                setErrorMessage(response.message || "Invalid Username or Password");
            }
        } catch (error) {
            setErrorMessage(error.message || "Invalid Username or Password");
        } finally {
            setLoading(false); // ปิดการโหลดเมื่อเสร็จ
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen text-slate-800">
       
            <div className="md:w-1/2 w-full flex flex-col justify-center items-center text-white p-8 bg-bg-MainColor">
                <img src="./MK_Ci.png" alt="Mikka Logo" className="mb-6 w-32 md:w-50" />

                <div className="w-40 h-40 rounded-2xl">
                    <img src="./Login.jpg" alt="Coffee Cup" className="rounded-2xl" />
                </div>
            </div>

            {/* Right Section */}
            <div className="md:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 md:p-10">
                <div className="w-full max-w-md">
                    <label className="text-bg-MainColor block font-bold text-lg mb-1 mt-2">
                        Username (Phone)
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="Phone*"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label className="block text-bg-MainColor font-bold text-lg mb-1 mt-2">Password</label>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Password*"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <img src="./Eye.png" className="w-8 h-8" />
                        </button>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
                    )}

                    <div className="w-full flex justify-center">
                        <button
                            className="w-60 text-white font-bold rounded-md py-2 mt-6 bg-bg-MainColor flex justify-center items-center"
                            onClick={handleLogin}
                            disabled={loading} // ปิดปุ่มขณะการโหลด
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white border-solid"></div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>

                    <div className="flex justify-between mt-4 text-bg-MainColor font-semibold text-sm">
                        <a href="/Register">Register</a>
                        <a href="/Forgot_Pass">Forgot Password</a>
                    </div>

                    {/* Contact & Privacy Section */}
                    <div className="flex flex-col mt-20">
                        <p className="text-gray-500 text-center mt-6 text-sm">
                            If you have any problem, contact our staff at
                            <a href="mailto:support@cafemikka.com" className="text-blue-600"> support@cafemikka.com</a>
                        </p>
                        <p className="text-gray-500 text-center mt-4 text-xs">
                            โปรดอ่านนโยบายความเป็นส่วนตัวของเราเพื่อรับทราบและทำความเข้าใจก่อนส่งข้อมูลทุกครั้ง
                            <a href="https://member.cafemikka.com/doc/TermsofService.pdf" className="text-blue-600"> ข้อกำหนดเงื่อนไข</a>
                            และ
                            <a href="https://member.cafemikka.com/doc/PrivacyPolicy.pdf" className="text-blue-600"> นโยบายความเป็นส่วนตัว</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
