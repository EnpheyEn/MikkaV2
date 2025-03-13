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

  const images = [
    "/Promotion.jpg",
    "/Promotion1.jpg",
    "/Promotion2.jpg",
  ];

  // Function to generate a random OTP
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOtp(otp);
    setOtpSent(true);
    setTimer(600);
    setTimerActive(true);
    alert(`Fake OTP sent: ${otp}`); // Display OTP for testing purposes
  };

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
              value="0891111112"
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
              onChange={(e) => setPhoneNumber(e.target.value)}
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
              onClick={handleSubmit}
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
                navigate("/Home");
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
