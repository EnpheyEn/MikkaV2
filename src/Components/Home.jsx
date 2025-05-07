import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import ImageSlider from "./ImageSlider";
import { login } from "../Components/APIManage/api";  // นำเข้า login function

// Styled component
const StyledComponent = styled.div`
  font-family: "DB Helvetica Thai", sans-serif;
`;

function Home() {
  const navigate = useNavigate();
  const [memberType, setMemberType] = useState("Member");
  const [pointsExpiry, setPointsExpiry] = useState("ไม่ระบุ");
  const [lastUpdateTime, setLastUpdateTime] = useState("ไม่ระบุ");
  const [isExclusive, setIsExclusive] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [coins, setCoins] = useState(0);
  const [points, setPoints] = useState();


  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = sessionStorage.getItem("userData");
        console.log("SessionStorage User Data:", storedUserData); // ✅ Debug sessionStorage

        if (!storedUserData) {
          console.warn("No user data found. Redirecting to login...");
          navigate("/login");
          return;
        }

        const user = JSON.parse(storedUserData);
        console.log("Parsed User Data:", user); // ✅ Debug JSON.parse

        setUsername(user.username);
        setFirstName(user.firstName);
        setlastName(user.lastName);
        setCoins(user.coins);
        setPoints(user.points);
        setIsExclusive(user.isExclusive);
        setPointsExpiry(dayjs(user.pointsExpiry).format("DD/MM/YYYY"));
        setLastUpdateTime(dayjs(user.lastUpdateTime).format("DD/MM/YYYY HH:mm"));
        setMemberType(user.isExclusive ? "Exclusive Member" : "Member");
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchUserData();
  }, []);

  // Define the number of images you have
  const numberOfImages = [];

  // Generate an array of image paths
  const images = Array.from({ length: numberOfImages }, (_, index) => `./Images/${index + 1}.jpg`);


  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center  ">
      <div className="w-full max-w-2xl">
      
        <div className="w-full max-w-full overflow-hidden mt-16">
        {/* Image Slider */}
        <ImageSlider/>
        </div>
        {/* Member Info */}
        <div className="text-bg-MainColor flex flex-col items-center gap-4 mt-6">
          <div className="items-center gap-2">
            <div className="indicator">
              <span className="p-3 text-white bg-[#D51F39] rounded-lg">
                {memberType}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            {/* คอลัมน์รูปภาพ */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24   flex items-center justify-center">
                <img
                  src={isExclusive ? "./icon.png" : "./Poor_mouse.png"}
                  alt={isExclusive ? "Ex Member" : "Member"}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <div className="w-24 h-24   flex items-center justify-center">
                <img src="/mk_ui_coin.png" alt="Cups" className="w-20 h-20 object-contain" />
              </div>
            </div>

            {/* คอลัมน์ข้อความ */}
            <div className="flex flex-col justify-center gap-16">
              <p className="text-lg text-black">{firstName && lastName ? `: ${firstName} ${lastName}` : "Guest"}</p>
              <p className="text-lg text-black">: {coins} /30 </p>
            </div>
            
          </div>
          <div className="justify-center text-center">
              <p ><b>Point Expiration:</b> {pointsExpiry}</p>
            </div>
        </div>

        {/* Exclusive Member Benefits */}
        {isExclusive && (
          <StyledComponent className="m-4">
            <div className="bg-bg-MainColor text-white p-4 text-start rounded-lg mt-10 max-w-md mx-auto text-sm ">
              <p>
                🎉 <b className="font-bold text-lg">Exclusive Member Benefits</b>: <br />
                1. รับส่วนลด 10 บาท ต่อแก้ว ตลอดจนถึง 31 ธันวาคม 2568 <br />
                Enjoy a 10 Baht discount on every drink until 31 December 2025. <br />
                2. รับเครื่องดื่มฟรี! 1 แก้ว ในเดือนเกิด <br />
                Get a FREE drink! 🎉 1 cup during your birthday month!
              </p>
            </div>
          </StyledComponent>
        )}

        

      </div>
    </div>
  );
}

export default Home;
