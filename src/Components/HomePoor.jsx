// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styled from "styled-components";
// import dayjs from "dayjs";
// import ImageSlider from "./ImageSlider"; // 👉 นำเข้า Component ใหม่

// // styled component
// const StyledComponent = styled.div`
//   font-family: "DB Helvetica Thai", sans-serif;
// `;

// function Home() {
//   const navigate = useNavigate();
//   const [pointsExpiry, setPointsExpiry] = useState("");
//   const [lastUpdateTime, setLastUpdateTime] = useState("");

//   useEffect(() => {
//     const coins = localStorage.getItem("coins");
//     const memberType = localStorage.getItem("memberType");
//     const expiryDate = localStorage.getItem("pointsExpiry");
//     const lastUpdate = localStorage.getItem("lastUpdateTime");

//     if (!coins || parseInt(coins) < 30) {
//       navigate("/HomePoor");
//     } else if (memberType === "exclusive") {
//       navigate("/Home");
//     }

//     setPointsExpiry(expiryDate ? dayjs(expiryDate).format("DD/MM/YYYY") : "ไม่ระบุ");
//     setLastUpdateTime(lastUpdate ? dayjs(lastUpdate).format("DD/MM/YYYY HH:mm") : "ไม่ระบุ");
//   }, [navigate]);

//   // รูปภาพที่ต้องการใช้ใน Swiper
//   const images = [
//     "/Promotion.jpg",
//     "/Promotion1.jpg",
//     "/Promotion2.jpg",
//   ];

//   return (
//     <div className="bg-white min-h-screen flex flex-col">
//       <div className="w-full max-w-md sm:max-w-2xl lg:max-w-3xl flex flex-col items-center mx-auto">
//         <h2 className="text-bg-MainColor font-medium text-2xl text-center p-2 mt-24">Membership</h2>

//         {/* 👉 ใช้ ImageSlider แทน Swiper เดิม */}
//         <ImageSlider images={images} />
//       </div>
//       {/* ส่วนข้อมูลสมาชิก */}
//       <div className="flex-col items-center justify-center sm:flex-row gap-6 mt-6">
//           <div className="flex justify-center">
//             <div className="w-20">
//               <span className="indicator-item badge badge-primary p-3 text-slate-100 ">Member</span>
//               <div className="w-20 h-14 p-4">
//                 <img src="./Poor_mouse.png" className="" alt="Ex Member" />
//               </div>
//             </div>
//             <p className="text-lg mt-2 text-slate-700">: Noey</p>
//           </div>

//           <div className="flex justify-center">
//             <div className="w-20 h-14">
//               <img src="./iconCup.png" className="" alt="Cups" />
//             </div>
//             <p className="text-lg mt-2 text-black">: 50</p>
//           </div>
//         </div>

//         <StyledComponent>
//           {/* แสดงวันหมดอายุของ Points และเวลาที่แก้ไขล่าสุด */}
//           <div className="p-5 mt-6 text-center text-sm text-gray-600  gap-6">
//             <p><b>Last Update:</b> {lastUpdateTime}</p>
//             <p><b>Points Expiry:</b> {pointsExpiry}</p>
//           </div>
//         </StyledComponent>

//       </div>

//   );
// }

// export default Home;