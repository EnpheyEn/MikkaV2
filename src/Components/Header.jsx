import React, { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, User, Phone, KeyRound, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  // ตรวจจับการคลิกนอกเมนูเพื่อปิด
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="bg-bg-MainColor text-white flex items-center justify-between p-4 fixed top-0 left-0 w-full z-50">
      {/* เมนูแฮมเบอร์เกอร์ (เฉพาะมือถือ) */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* โลโก้กลาง */}
      <Link to="/Home">
        <img src="./MK_Ci.png" className="h-10 w-24 m-1" alt="Mikko Coffee Roasters" />
      </Link>

      {/* เมนู (รวม Desktop + Mobile) */}
      <div
        ref={menuRef}
        className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-14 left-0 w-full md:w-auto text-bg-MainColor bg-white md:bg-transparent md:text-white shadow-md md:shadow-none p-4 md:p-0 gap-2 md:gap-4`}
      >
        <Link
          to="/Home"
          className={`relative flex items-center gap-2 px-4 py-2 hover:bg-gray-200 md:hover:bg-transparent ${location.pathname === "/Home" ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white" : ""
            }`}
        >
          <Home size={18} /> Home
        </Link>
        <Link
          to="/EditProflie"
          className={`relative flex items-center gap-2 px-4 py-2 hover:bg-gray-200 md:hover:bg-transparent ${location.pathname === "/EditProflie" ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white" : ""
            }`}
        >
          <User size={18} /> Edit Profile
        </Link>
        <Link
          to="/ResetPassword"
          className={`relative flex items-center gap-2 px-4 py-2 hover:bg-gray-200 md:hover:bg-transparent ${location.pathname === "/ResetPassword" ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white" : ""
            }`}
        >
          <KeyRound size={18} /> Reset Password
        </Link>
        <Link
          to="/ChangeNumber"
          className={`relative flex items-center gap-2 px-4 py-2 hover:bg-gray-200 md:hover:bg-transparent ${location.pathname === "/ChangeNumber" ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white" : ""
            }`}
        >
          <Phone size={18} /> Change Phone Number
        </Link>
      </div>

      {/* ปุ่มล็อกเอาต์ */}
      <Link to="/" onClick={() => sessionStorage.removeItem("userData")}>
        <LogOut size={24} />
      </Link>

    </div>
  );
}

export default Header;
