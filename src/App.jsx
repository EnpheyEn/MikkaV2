import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Header from "./Components/Header";
import EditProflie from "./Components/EditProflie";
import ResetPassword from "./Components/ResetPassword";
import ChangeNumber from "./Components/ChangeNumber";
import Register from "./Components/Register";
import Forgot_Pass from "./Components/Forgot_Pass";
import CoinHistory from "./Components/CoinHistory";

// import HomePoor from "./Components/HomePoor";

// ✅ เช็คว่า Login แล้วหรือยัง
const isAuthenticated = () => {
  return sessionStorage.getItem("isLoggedIn") === "true"; // หรือเปลี่ยนตาม key ที่คุณใช้
};

// ✅ Route ป้องกัน
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const isLoginPage = ["/", "/Register", "/Forgot_Pass"].includes(location.pathname);
  const showHeader = isAuthenticated() && !isLoginPage;

  return (
    <div className="bg-white">
      {showHeader && <Header />}
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Forgot_Pass" element={<Forgot_Pass />} />

        {/* protected routes */}
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/EditProflie" element={<ProtectedRoute><EditProflie /></ProtectedRoute>} />
        <Route path="/ResetPassword" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
        <Route path="/ChangeNumber" element={<ProtectedRoute><ChangeNumber /></ProtectedRoute>} />
        <Route path="/CoinHistory" element={<ProtectedRoute><CoinHistory /></ProtectedRoute>} />
        <Route
          path="*"
          element={
            isAuthenticated() ? <Navigate to="/Home" replace /> : <Navigate to="/" replace />
          }
        />


        {/* <Route path="/HomePoor" element={<ProtectedRoute><HomePoor /></ProtectedRoute>} /> */}
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
