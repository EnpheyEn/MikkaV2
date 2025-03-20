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
        setMemberType(user.isExclusive ? "Exclusive" : "Member");
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchUserData();
  }, []);

  // Image Slider images
  const images = ["/Promotion.jpg", "/Promotion1.jpg", "/Promotion2.jpg"];

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-2xl">
        <h2 className="text-bg-MainColor font-medium text-2xl text-center p-2 mt-24">Membership</h2>

        {/* Image Slider */}
        <ImageSlider images={images} />

        {/* Member Info */}
        <div className="text-bg-MainColor flex flex-col items-center gap-4 mt-6">
          <div className="items-center gap-2">
            <div className="indicator">
              <span className="indicator-item badge badge-primary p-3 text-slate-100">
                {memberType}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-20 h-14">
              <img
                src={isExclusive ? "./icon.png" : "./Poor_mouse.png"}
                alt={isExclusive ? "Ex Member" : "Member"}
                className="w-full h-full"
              />
            </div>
            <p className="text-lg text-black">
              {firstName && lastName ? `: ${firstName} ${lastName}` : "Guest"}
            </p>

          </div>

          <div className="flex items-center">
            <div className="w-20 h-14 ">
              <img src="/mk_ui_coin.png" alt="Cups" />
            </div>
            <p className="text-lg mt-6 text-black"> : {coins}</p>
          </div>
        </div>

        {/* Exclusive Member Benefits */}
        {isExclusive && (
          <StyledComponent>
            <div className="bg-bg-MainColor text-white p-4 text-start rounded-lg mt-16 max-w-md mx-auto text-sm ">
              <p>
                🎉 <b>Exclusive Member Benefits</b>: <br />
                1. รับส่วนลด 10 บาท ต่อแก้ว ตลอดจนถึง 31 ธันวาคม 2568 <br />
                Enjoy a 10 Baht discount on every drink until 31 December 2025. <br />
                2. รับเครื่องดื่มฟรี! 1 แก้ว ในเดือนเกิด <br />
                Get a FREE drink! 🎉 1 cup during your birthday month!
              </p>
            </div>
          </StyledComponent>
        )}

        {/* Points Expiry and Last Update */}
        <StyledComponent>
          <div className="mt-6 text-center text-sm text-gray-600 p-3">
            <p><b>Last Update:</b> {lastUpdateTime}</p>
            <p><b>Points Expiry:</b> {pointsExpiry}</p>
          </div>
        </StyledComponent>

      </div>
    </div>
  );
}

export default Home;
