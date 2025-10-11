import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import OAuthCallback from "../pages/OAuthCallback";
import ZerodhaCallback from "../pages/ZerodhaCallback";
import ProfilePage from "../pages/ProfilePage";
import ParentComponent from "../components/main/ParentComponent";
import ChatPage from "../pages/ChatPage";
import Dashboard from "../pages/DashboardPage";
import LearnPage from "../pages/LearnPage";
import FinancePage from "../pages/FinancePage";
import { useAuth } from "../context/AuthContext";
import { setUserData } from "../redux/slices/userDataSlice";

function AppRoutes() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [scenarios, setScenarios] = useState([]);
  const location = useLocation();

  // Update userData when user is available
  useEffect(() => {
    if (user) {
      dispatch(
        setUserData({
          name: user?.name ?? "Full Name",
          email: user?.email ?? "abc@gmail.com",
          avatar: user?.profile_picture ?? "/profile-default.png",
          dateOfBirth: user?.birthday ?? "",
          gender: user?.gender ?? "Prefer not to say",
        })
      );
    }
  }, [user, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {!location.pathname.startsWith("/home") && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/zerodha/callback" element={<ZerodhaCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/*"
          element={
            <ProtectedRoute>
              <ParentComponent />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ChatPage scenarios={scenarios} setScenarios={setScenarios} />
            }
          />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="finance" element={<FinancePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default AppRoutes;
