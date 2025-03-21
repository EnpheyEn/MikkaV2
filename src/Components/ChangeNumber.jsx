import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";

function ChangeNumber() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State สำหรับ Modal
  const [oldPhone, setOldPhone] = useState("");

  const images = [
    "/Promotion.jpg",
    "/Promotion1.jpg",
    "/Promotion2.jpg",
  ];

  // Countdown Timer Effect
  useEffect(() => {
    let interval;

    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      alert("OTP expired!");
      setTimerActive(false);
      setOtpSent(false);
    }

    return () => clearInterval(interval);
  }, [timerActive, timer]);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
  }, [otp]);


  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp === generatedOtp.toString()) {
      setIsModalOpen(true); // เปิด Modal แทน alert
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };

  const [email, setEmail] = useState(""); // เพิ่ม state สำหรับ email

useEffect(() => {
  const storedUserData = sessionStorage.getItem("userData");
  if (storedUserData) {
    const userData = JSON.parse(storedUserData);
    console.log("Loaded user data:", userData); // ✅ Debug
    setOldPhone(userData.tel || "");  
    setMemberId(userData.c_MB_ID || "");
    setEmail(userData.email || ""); // ✅ ดึง email จาก session
  }
}, []);

const generateOtp = async () => {
  if (!email) {
    alert("Email not found. Please log in again.");
    return;
  }

  try {
    // ดึง IP Address ของผู้ใช้
    let userIP = "0.0.0.0"; // กำหนดค่าเริ่มต้น
    try {
      const ipResponse = await fetch("https://api64.ipify.org?format=json");
      const ipData = await ipResponse.json();
      userIP = ipData.ip || "0.0.0.0";
    } catch (error) {
      console.error("Failed to fetch IP:", error);
    }

    console.log("Sending data:", { IP: userIP, email, tel: "" });

    const response = await fetch("http://192.168.20.5/mk-member-api/api/Member/send-otp-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        IP: userIP,
        email: email,  // ✅ ใช้ email จาก session
        tel: ""        // ส่ง Tel เป็นค่าว่าง
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to send OTP!");

    setOtpSent(true);
    setTimer(600);
    setTimerActive(true);

    alert("OTP has been sent to your email.");
  } catch (error) {
    alert(error.message || "An error occurred while sending OTP.");
  }
};

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch("http://192.168.20.5/mk-member-api/api/Member/verify-reset-tel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: otp,
          oldPhone: oldPhone,  // เบอร์โทรเดิม (ค่าคงที่หรือดึงจาก state)
          newPhone: phoneNumber,  // เบอร์โทรใหม่ที่ผู้ใช้กรอก
          c_MB_ID: memberId  // ส่งค่า c_MB_ID ไปที่ API

        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "OTP verification failed!");

      alert("Phone number updated successfully!");
      setIsModalOpen(true); // เปิด Modal แจ้งผลสำเร็จ
    } catch (error) {
      alert(error.message || "An error occurred while verifying OTP.");
    }
  };



 const [memberId, setMemberId] = useState(""); // เพิ่ม state สำหรับ c_MB_ID

useEffect(() => {
  const storedUserData = sessionStorage.getItem("userData");
  if (storedUserData) {
    const userData = JSON.parse(storedUserData);
    setOldPhone(userData.tel);  // ดึงค่าเบอร์โทรจาก session
    setMemberId(userData.c_MB_ID);  // ดึงค่า c_MB_ID จาก session
  }
}, []);



  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center p-6">
      <div className="mt-16 p-3 sm:mt-12 w-full max-w-2xl">
        <ImageSlider images={images} />

        <div className="flex items-center text-bg-MainColor font-medium justify-center text-lg mt-4">
          <h4>Change Number</h4>
          <Phone color="#D51F39" className="ml-2" />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 w-full mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-bg-MainColor mb-1">
              Register Phone Number (เบอร์โทร)
            </label>
            <input
              type="text"
              value={oldPhone || "Loading..."}
              className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
              readOnly
            />


          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-bg-MainColor mb-1">
              New Phone Number (เบอร์โทรใหม่)
            </label>
            <input
              type="text"
              placeholder="New Phone Number*"
              className="w-full border rounded-lg p-2 bg-white text-gray-700"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // เอาเฉพาะตัวเลข
                if (value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
              maxLength={10} // จำกัดความยาวสูงสุด
            />

          </div>

          <button
            className="w-full bg-bg-MainColor text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 mb-4"
            onClick={generateOtp}
          >
            Request OTP
          </button>

          {otpSent && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-bg-MainColor mb-1">
                OTP
              </label>
              <input
                type="text"
                placeholder="OTP*"
                className="w-full border rounded-lg p-2 bg-white text-gray-700"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          {otpSent && (
            <div className="text-center mb-2">
              <p className="text-sm text-bg-MainColor">
                OTP expires in: <b>{formatTime(timer)}</b>
              </p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              className="bg-bg-MainColor text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600"
              onClick={verifyOtp}
              disabled={timer === 0}
            >
              Confirm
            </button>

            <button
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700"
              onClick={() => navigate("/Home")}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 flex justify-center items-center mt-10 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center relative">
            <h2 className="text-xl font-semibold text-bg-MainColor mb-4">OTP Verified!</h2>
            <p className="text-gray-700 mb-4">Your phone number has been successfully changed.</p>
            <button
              className="bg-bg-MainColor text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600"
              onClick={() => {
                setIsModalOpen(false);
                navigate("/");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ChangeNumber;