// src/api/api.js
import axios from "axios";
// import { useEffect } from "react";


const API_KEY = "pohzof-duFpum-6nosqu"; // 🔑 ใส่ API Key ที่นี่




export const login = async (API_URL,tel, password) => {
  

    try {
        const response = await axios.post(
            API_URL+"Member/login",
            { tel, password },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY, // 🔑 ส่ง API Key ใน Header
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials":
                        'true', // Required for cookies, authorization headers with HTTPS
                    "Access-Control-Allow-Headers":
                        "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                },
            }
        );
        return response.data; // ✅ ส่งข้อมูลที่ได้กลับไปให้ UI ใช้งาน
    } catch (error) {
        throw error.response ? error.response.data : error.message; // ✅ จัดการข้อผิดพลาด
    }
};

