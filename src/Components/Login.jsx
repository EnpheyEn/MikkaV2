import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Components/APIManage/api"

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await login(username, password);
            console.log("API Response:", response); 

            if (response.isSuccess) {
                console.log("Saved User Data:", response.data);
                sessionStorage.setItem("userData", JSON.stringify(response.data));
                setModalMessage("Login Successful! Welcome to Mikka Coffee Roasters.");
            } else {
                setModalMessage(response.message || "Invalid Username or Password");
            }

            setIsModalOpen(true); // ✅ เปิด modal ไม่ว่าผลลัพธ์จะเป็นอะไร
        } catch (error) {
            setModalMessage(error.message || "Invalid Username or Password");
            setIsModalOpen(true);
        }
    };
    

    const closeModal = () => {
        setIsModalOpen(false);
        if (modalMessage === "Login Successful! Welcome to Mikka Coffee Roasters.") {
            navigate("/Home"); // ✅ เข้า Home ถ้า Login สำเร็จ
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen text-slate-800">
            {/* Left Section */}
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

                    <div className="w-full flex justify-center">
                        <button
                            className="w-60 text-white font-bold rounded-md py-2 mt-6 hover:bg-red-700 bg-bg-MainColor"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                    </div>

                    <div className="flex justify-between mt-4 text-bg-MainColor font-semibold text-sm">
                        <a href="/Register">Register</a>
                        <a href="/Forgot_Pass">Forgot Password</a>
                    </div>

                    {/* Contact & Privacy Section */}
                    <div className="flex flex-col mt-24">
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                        <h3 className="text-lg font-bold text-gray-700">Mikka Coffee Roasters</h3>
                        <p className="mt-4 text-gray-600">{modalMessage}</p>
                        <button
                            className="mt-4 bg-bg-MainColor text-white px-4 py-2 rounded-md"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
