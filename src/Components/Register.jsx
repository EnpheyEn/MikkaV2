import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    setError("");
  
    if (Object.values(formData).some((val) => val === "" || val === false)) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
  
    // ✅ ตรวจสอบความยาวและเงื่อนไขรหัสผ่าน
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัว และมีทั้งตัวพิมพ์เล็กและตัวพิมพ์ใหญ่");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://192.168.20.5/mk-member-api/api/Member/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          tel: formData.tel,
          birthday: formData.birthday,
          idCard: formData.idCard,
          email: formData.email,
          password: formData.password,
        }
      );
  
      if (response.status === 200) {
        setShowModal(true);
      } else {
        setError(response.data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch (error) {
      console.error("Error registering:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่");
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 bg-[url('./BGMikka.png')] bg-cover bg-center">
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
              <label className="block text-sm text-gray-500 mb-1">First Name</label>
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
              <label className="block text-sm text-gray-500 mb-1">Last Name</label>
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
              <label className="block text-sm text-gray-500 mb-1">Phone</label>
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
              <label className="block text-sm text-gray-500 mb-1">Birthday</label>
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
              <label className="block text-sm text-gray-500 mb-1">ID Card / Passport No.</label>
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
              <label className="block text-sm text-gray-500 mb-1">Email address</label>
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
              <label className="block text-sm text-gray-500 mb-1">Password</label>
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
              <label className="block text-sm text-gray-500 mb-1">Confirm Password</label>
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

          <div className="flex flex-col justify-between mt-6">
          <div className="flex flex-row gap-5 justify-end">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
