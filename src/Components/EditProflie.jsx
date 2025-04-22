import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Pencil } from "lucide-react";
import ImageSlider from "./ImageSlider";
import thai_amphures from "../Data_Json/thai_amphures.json";
import thai_provinces from "../Data_Json/thai_provinces.json";
import thai_tambons from "../Data_Json/thai_tambons.json";
// import WebConfig from "../config/WebConfig"


function EditProfile() {
  const navigate = useNavigate();
 
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);



  // ดึงข้อมูลจาก sessionStorage
  const savedUserData = JSON.parse(sessionStorage.getItem("userData"));

  const [formData, setFormData] = useState({
    firstName: savedUserData?.firstName || "",
    lastName: savedUserData?.lastName || "",
    tel: savedUserData?.tel || "",
    birthday: savedUserData?.birthDay ? savedUserData.birthDay.split("T")[0] : "",   // ไม่ตัดเวลาออก
    email: savedUserData?.email || "",
    address: savedUserData?.address || "",
    idCard: savedUserData?.idCard || "",
    province: savedUserData?.province || "",
    district: savedUserData?.district || "",
    subDistrict: savedUserData?.subDistrict || "",
    postal: savedUserData?.postal || "",
  });


  const formDataRef = useRef(null); // ใช้เพื่อลดการอัปเดต state ที่ไม่จำเป็น

  useEffect(() => {
    if (savedUserData) {
      const province = thai_provinces.find(p => p.name_th === savedUserData.province);
      const district = thai_amphures.find(a => a.province_id === province?.id && a.name_th === savedUserData.district);
      const subDistrict = thai_tambons.find(t => t.amphure_id === district?.id && t.name_th === savedUserData.subDistrict);

      const newFormData = {
        province: province ? { value: province.id, label: province.name_th } : null,
        district: district ? { value: district.id, label: district.name_th } : null,
        subDistrict: subDistrict ? { value: subDistrict.id, label: subDistrict.name_th } : null,
        postal: subDistrict?.zip_code || ""
      };

      if (JSON.stringify(newFormData) !== JSON.stringify(formDataRef.current)) {
        formDataRef.current = newFormData;
        setFormData(prevData => ({
          ...prevData,
          ...newFormData
        }));
      }
    }
  }, [savedUserData]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, selected) => {
    if (name === "province") {
      setFormData({
        ...formData,
        province: selected,
        district: null,
        subDistrict: null,
        postal: ""
      });
    } else if (name === "district") {
      setFormData({
        ...formData,
        district: selected,
        subDistrict: null,
        postal: ""
      });
    } else if (name === "subDistrict") {
      const foundSubDistrict = thai_tambons.find(t => t.id === selected?.value);
      setFormData({
        ...formData,
        subDistrict: selected,
        postal: foundSubDistrict?.zip_code || ""
      });
    } else {
      setFormData({ ...formData, [name]: selected });
    }
  };

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


  const validateAndSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.tel || !formData.idCard || !formData.birthday || !formData.province || !formData.subDistrict || !formData.postal || !formData.district || !formData.address) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (formData.idCard.length !== 13) {
      setErrorMessage("ID Card must be 13 digits.");
      return;
    }

    if (formData.tel.length !== 10) {
      setErrorMessage("Phone number must be 10 digits.");
      return;
    }

    setErrorMessage("");
    setLoading(true); // 👈 เริ่มโหลด

    const token = sessionStorage.getItem("token");
    const c_MB_ID = JSON.parse(sessionStorage.getItem("userData"))?.c_MB_ID;

    const payload = {
      c_MB_ID,
      firstName: formData.firstName,
      lastName: formData.lastName,
      tel: formData.tel,
      birthDay: formData.birthday,
      email: formData.email,
      address: formData.address,
      idCard: formData.idCard,
      province: formData.province.label,
      district: formData.district.label,
      subDistrict: formData.subDistrict.label,
      postal: formData.postal ? String(formData.postal) : ""
    };

    try {
      const response = await fetch(`${window.env.API_BASE_URL}/Member/edit-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");

      sessionStorage.setItem("userData", JSON.stringify({ ...JSON.parse(sessionStorage.getItem("userData")), ...payload }));
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false); // 👈 หยุดโหลด
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-bg-MainColor mr-2"></div>
        </div>
      </div>
    );
  }



  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center text-slate-70 p-6">
      <div className="mt-16 p-3 sm:mt-12 w-full max-w-2xl">
        <ImageSlider/>
        <div className="flex items-center font-medium justify-center text-lg mt-4 text-bg-MainColor">
          <h4>Edit Profile</h4> <Pencil className="ml-2" />
        </div>

        <form className="mt-6 space-y-4 bg-white shadow-md rounded-lg p-9 w-full">

          {/* Input Fields */}
          {[
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Phone", name: "tel", type: "int", maxLength: 10, readOnly: true }, // ✅ ป้องกันการแก้ไข
            { label: "Birthday", name: "birthday", type: "date" },
            { label: "ID Card / Passport No.", name: "idCard", type: "int", maxLength: 13 },
            { label: "Email", name: "email", type: "email" },
            { label: "Address", name: "address", type: "textarea" }
          ].map(({ label, name, type, maxLength, readOnly }) => (
            <div key={name}>
              <label className="block text-sm text-gray-500">{label}</label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black h-20 resize-none"
                  placeholder={label}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={name === "tel" ? undefined : handleChange} // ❌ ปิด onChange เฉพาะ tel
                  className={`w-full border border-gray-300 rounded-lg p-2 ${name === "tel" ? "bg-white text-black cursor-not-allowed" : "bg-white text-black"
                    }`}
                  placeholder={label}
                  maxLength={maxLength}
                  readOnly={readOnly} // ✅ ใช้ readOnly
                />
              )}
            </div>
          ))}

          {/* Province, District, Sub-District */}
          {[
            { label: "Province", name: "province", options: thai_provinces },
            { label: "District", name: "district", options: thai_amphures.filter(d => d.province_id === formData.province?.value) },
            { label: "Sub District", name: "subDistrict", options: thai_tambons.filter(t => t.amphure_id === formData.district?.value) }
          ].map(({ label, name, options }) => (
            <div key={name}>
              <label className="block text-sm ">{label}</label>
              <Select
                options={options.map(opt => ({ value: opt.id, label: opt.name_th }))}
                value={formData[name]}
                onChange={selected => handleSelectChange(name, selected)}
                isSearchable
                isDisabled={!formData.province && name !== "province"}
              />
            </div>
          ))}

          {/* Postal Code */}
          <div>
            <label className="block text-sm">Postal Code</label>
            <input
              type="text"
              name="postal" // ✅ เพิ่ม name ให้ input
              value={formData.postal}
              readOnly
              className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black cursor-not-allowed"
            />
          </div>

          {errorMessage && (
            <div className="text-bg-MainColor font-medium text-center">
              {errorMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={validateAndSubmit}
              className="w-full bg-bg-MainColor text-white p-2 rounded-lg font-medium hover:bg-rose-700"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate("/Home")}
              className="w-full bg-gray-500 text-white p-2 rounded-lg font-medium hover:bg-gray-700"
            >
              Back
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}

export default EditProfile;