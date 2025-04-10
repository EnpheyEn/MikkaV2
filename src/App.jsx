import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Header from "./Components/Header";
import EditProflie from "./Components/EditProflie";
import ResetPassword from "./Components/ResetPassword";
import ChangeNumber from "./Components/ChangeNumber";
import Register from "./Components/Register";
import Forgot_Pass from "./Components/Forgot_Pass";
// import HomePoor from "./Components/HomePoor";

function AppContent() {
    const location = useLocation(); 
    const hideHeader = ["/", "/Register", "/Forgot_Pass"].includes(location.pathname); 
    // ซ่อน Header ในหน้า Login, Register, Forgot_Pass
    
    return (
      <div className="bg-white">
        {!hideHeader && <Header />} {/* แสดง Header ถ้าไม่ใช่หน้า Login, Register, Forgot_Pass */}
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/EditProflie" element={<EditProflie />} />
            <Route path="/ResetPassword" element={<ResetPassword />} />
            <Route path="/ChangeNumber" element={<ChangeNumber />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Forgot_Pass" element={<Forgot_Pass />} />
            {/* <Route path="/HomePoor" element={<HomePoor/>} /> */}
        </Routes>
      </div>
    );
}

function App() {
    return (
      <Router>
          <AppContent />
      </Router>
    );
}

export default App;
