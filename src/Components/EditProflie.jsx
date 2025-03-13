import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Pencil } from "lucide-react";
import ImageSlider from "./ImageSlider";
import thai_amphures from "../Data_Json/thai_amphures.json";
import thai_provinces from "../Data_Json/thai_provinces.json";
import thai_tambons from "../Data_Json/thai_tambons.json";

function EditProfile() {
  const navigate = useNavigate();
  const images = ["/Promotion.jpg", "/Promotion1.jpg", "/Promotion2.jpg"];
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    province: null,
    district: null,
    subDistrict: null,
    postalCode: null,
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
        postalCode: subDistrict?.zip_code || ""
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
        postalCode: ""
      });
    } else if (name === "district") {
      setFormData({
        ...formData,
        district: selected,
        subDistrict: null,
        postalCode: ""
      });
    } else if (name === "subDistrict") {
      const foundSubDistrict = thai_tambons.find(t => t.id === selected?.value);
      setFormData({
        ...formData,
        subDistrict: selected,
        postalCode: foundSubDistrict?.zip_code || ""
      });
    } else {
      setFormData({ ...formData, [name]: selected });
    }
  };
  

  const validateAndSubmit = () => {
    // ตรวจสอบการกรอกข้อมูล
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.tel || !formData.idCard || !formData.birthday || !formData.province || !formData.subDistrict || !formData.postalCode || !formData.district || !formData.address) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
  
    // ตรวจสอบความยาวของ idCard (ต้องมี 13 ตัว)
    if (formData.idCard.length !== 13) {
      setErrorMessage("ID Card must be 13 digits.");
      return;
    }
  
    // ตรวจสอบความยาวของ tel (ต้องมี 10 ตัว)
    if (formData.tel.length !== 10) {
      setErrorMessage("Phone number must be 10 digits.");
      return;
    }
  
    // เคลียร์ข้อความผิดพลาด
    setErrorMessage("");
  
    // บันทึกข้อมูลลง sessionStorage
    sessionStorage.setItem("userData", JSON.stringify(formData));
  
    setIsModalOpen(true);
  };
  

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center text-slate-70 p-6">
      <div className="mt-16 p-3 sm:mt-12 w-full max-w-2xl">
        <ImageSlider images={images} />
        <div className="flex items-center font-medium justify-center text-lg mt-4 text-bg-MainColor">
          <h4>Edit Profile</h4> <Pencil className="ml-2" />
        </div>

        <form className="mt-6 space-y-4 bg-white shadow-md rounded-lg p-9 w-full">
        {errorMessage && <div className="text-bg-MainColor font-medium text-center">{errorMessage}</div>}
          {/* Input Fields */}
          {[
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Phone", name: "tel", type: "int", maxLength: 10 },
            { label: "Birthday", name: "birthday", type: "date" }, // ✅ Birthday จะแสดงถูกต้อง
            { label: "ID Card / Passport No.", name: "idCard", type: "int", maxLength: 13 },
            { label: "Email", name: "email", type: "email" },
            { label: "Address", name: "address", type: "textarea" }
          ].map(({ label, name, type, maxLength }) => (
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
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
                  placeholder={label}
                  maxLength={maxLength}
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
              <label className="block text-sm text-gray-500">{label}</label>
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
            <label className="block text-sm text-gray-500">Postal Code</label>
            <input type="text" value={formData.postalCode} readOnly className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black" />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={validateAndSubmit} className="w-full bg-bg-MainColor text-white p-2 rounded-lg font-medium hover:bg-rose-700">Update</button>
            <button type="button" onClick={() => navigate("/Home")} className="w-full bg-gray-500 text-white p-2 rounded-lg font-medium hover:bg-gray-700">Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;