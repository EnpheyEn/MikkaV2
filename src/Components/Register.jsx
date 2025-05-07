import React, { useState,useEffect, use } from "react";
import { useNavigate } from "react-router-dom";



function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    tel: "",
    birthday: "",
    idCard: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptPolicy: false,
  });

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // ✅ เพิ่ม state สำหรับ Modal
  const [configData, setConfigData] = useState('')
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


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = value;

    if (name === "tel" || name === "idCard") {
      updatedValue = value.replace(/\D/g, ""); // ✅ ลบอักขระที่ไม่ใช่ตัวเลข
      if (name === "tel" && updatedValue.length > 10) return;
      if (name === "idCard" && updatedValue.length > 13) return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : updatedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  
    if (!passwordRegex.test(formData.password)) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัว และมีทั้งตัวพิมพ์เล็กและตัวพิมพ์ใหญ่");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
  
    setError("");
  
    try {
      const response = await fetch(`${window.env.API_BASE_URL}/Member/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          tel: formData.tel,
          birthday: formData.birthday,
          idCard: formData.idCard,
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setShowModal(true);
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setError(error.message || "ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 bg-[url('./BGMikka1.png')] bg-cover bg-center">
      <div className="mt-0 p-3 sm:mt-5 w-full max-w-2xl">
        <div className="text-bg-MainColor font-medium text-xl  text-center">
          <h4>Register</h4>
        </div>

        <form
          className="mt-6 bg-white shadow-md rounded-lg p-4 w-full space-y-4 text-bg-MainColor"
          onSubmit={handleSubmit}
        >
          {/* Input Fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="flex">
              <label className="block text-lg text-bg-MainColor ">First Name *</label>
              <label className="block text-xs text-slate-500 mt-2">(ชื่อจริง)</label>
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
                placeholder="First Name"
              />
            </div>
            <div>
            <div className="flex">
              <label className="block text-lg text-bg-MainColor mb-1">Last Name *</label>
              <label className="block text-xs text-slate-500 mt-2">(นามสกุล)</label>
              </div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
            <div className="flex">
              <label className="block text-lg text-bg-MainColor mb-1">Phone *</label>
              <label className="block text-xs text-slate-500 mt-2">(เบอร์โทร)</label>
              </div>
              <input
                type="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
                placeholder="0885521111"
              />
            </div>
            <div>
            <div className="flex">
              <label className="block text-lg text-bg-MainColor mb-1">Birthday *</label>
              <label className="block text-xs text-slate-500 mt-2">(วันเกิด)</label>
              </div>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
            <div className="flex">
              <label className="block text-l text-bg-MainColor mb-1">ID Card / Passport No. *</label>
              <label className="block text-xs text-slate-500 mt-2">(บัตรประชาชน/หนังสือเดินทาง)</label>
              </div>
              <input
                type="tel"
                name="idCard"
                value={formData.idCard}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
                placeholder="1234567890123"
              />
            </div>
            <div>
            <div className="flex">
              <label className="block text-lg text-bg-MainColor mb-1">Email address *</label>
              <label className="block text-xs text-slate-500 mt-2">(อีเมล์)</label>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
            <div className="flex">
              <label className="block text-lg text-bg-MainColor mb-1">Password *</label>
              <label className="block text-xs text-slate-500 mt-2">(รหัสผ่าน)</label>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
                placeholder="Password"
              />
            </div>
            <div>
            <div className="flex">
              <label className="block text-lg text-bg-MainColor mb-1">Confirm Password *</label>
              <label className="block text-xs text-slate-500 mt-2">(ยืนยันรหัสผ่าน)</label>
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
                placeholder="Confirm Password"
              />
            </div>
          </div>


          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="acceptPolicy"
              checked={formData.acceptPolicy}
              onChange={handleChange}
              className="w-4 h-4 border border-gray-300 rounded"
            />
            <p className="text-gray-500 text-sm">
              ฉันยอมรับ <a href="#" className="text-blue-600">ข้อกำหนดและเงื่อนไข</a>
            </p>
          </div>

          {error && <p className="text-red-500 text-sm text-center item">{error}</p>}
          <div className="flex flex-col justify-between">
          <div className="flex flex-row gap-24 justify-center">
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg font-medium 
                ${formData.acceptPolicy ? "bg-bg-MainColor text-white hover:bg-red-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              disabled={!formData.acceptPolicy}
            >
              Confirm
            </button>
            <button className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700" onClick={() => navigate("/")}>
              Back
            </button>
            </div>
          </div>
        </form>
      </div>

      {/* ✅ Modal สำหรับแจ้งเตือน */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold text-green-600">Successfully!</h2>
            <p className="text-gray-600 mt-2">You have successfully registered.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-bg-MainColor text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
