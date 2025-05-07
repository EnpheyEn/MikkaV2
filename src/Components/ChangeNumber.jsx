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
  const [timerActive, setTimerActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State สำหรับ Modal
  const [oldPhone, setOldPhone] = useState("");
  const [timer, setTimer] = useState(window.env?.OTP_TIMEOUT );
  const [configData, setConfigData] = useState(null);
  const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับการโหลด

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
      setLoading(false);
    }

    return () => clearInterval(interval);
  }, [timerActive, timer]);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
  }, [otp]);

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

  useEffect(() => {
    if (window.env) {
      // Proceed with your logic here
      const timeout = window.env.OTP_TIMEOUT ;
      setTimer(timeout);
    } else {
      console.log("Config not loaded yet.");
    }
  }, []);  // Runs only once when the component mounts


  const generateOtp = async () => {
    setLoading(true); // เริ่มการโหลด
    if (!window.env || !window.env.API_BASE_URL) {
      alert("Configuration is not loaded yet. Please try again later.");
      return;
    }

    try {
      const ipResponse = await fetch("https://api64.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const userIP = ipData.ip;
      const response = await fetch(`${window.env.API_BASE_URL}/Member/send-otp-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tel: oldPhone,
          email: "",
          c_MB_ID: memberId,
          IP: userIP,
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP!");

      setOtpSent(true);
      setTimer(window.env.OTP_TIMEOUT); // ✅ ใช้ค่าจาก WebConfig
      setTimerActive(true);

      alert("OTP has been sent to your new phone number.");
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
      const response = await fetch(`${window.env.API_BASE_URL}/Member/verify-reset-tel`, { // ✅ ใช้ WebConfig
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
      navigate("/"); // เมื่อกด OK ให้ไปหน้า Login
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
    <div className="bg-gray-100 min-h-screen flex flex-col items-center ">
      <div className="mt-20  w-full max-w-2xl ">
       <div className="w-full max-w-full overflow-hidden ">
         <ImageSlider/>
        </div>

        <div className="flex items-center text-bg-MainColor font-medium justify-center text-lg mt-4">
          <h4>Change Number</h4>
          <Phone color="#D51F39" className="ml-2" />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 w-full mt-6 ">
          <div className="mb-4">
            <div className="flex">
              <label className="block text-sm text-bg-MainColor mb-1">Register Phone Number *</label>
              <label className="block text-xs text-slate-500 mt-2">(เบอร์โทร)</label>
            </div>
            
            <input
              type="text"
              value={oldPhone || "Loading..."}
              className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
              readOnly
            />


          </div>

          <div className="mb-4">
          <div className="flex">
              <label className="block text-sm text-bg-MainColor mb-1">New Phone Number *</label>
              <label className="block text-xs text-slate-500 mt-2">(เบอร์โทรใหม่)</label>
            </div>
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
            className={`w-full text-white px-6 py-2 rounded-lg font-medium mb-4 ${(loading || timerActive || !phoneNumber)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-bg-MainColor hover:bg-red-600"
              }`}
            onClick={generateOtp}
            disabled={loading || timerActive || !phoneNumber} // ✅ เช็กว่ามีเบอร์หรือยัง
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
              </div>
            ) : timerActive ? (
              `Wait ${formatTime(timer)}`
            ) : (
              "Request OTP"
            )}
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

    </div>
  );
}

export default ChangeNumber;