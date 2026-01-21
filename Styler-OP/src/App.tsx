import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import NotFound from "./pages/NotFound";
import Home from "./pages/home/DashBoard";
import Auth from "./pages/auth/Auth";
import { useAppDispatch, useAppSelector } from "./hooks/All_Hooks";
import { useEffect } from "react";
import { checkCurrentUser } from "./redux/slice/authSlice";
import {RefreshTokens} from './services/RefreshTokens'
function App() {
  const dispatch = useAppDispatch();
  const { authChecked } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!authChecked) {
      dispatch(checkCurrentUser());
    }

  }, [authChecked,dispatch]);

  // ✅ Wait until auth check finishes
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 w-1/3 bg-gray-300 rounded" />
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-2/3 bg-gray-200 rounded" />
    </div>
      </div>
    );
  }

  return (
    <>
    <RefreshTokens/>
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route path="/auth" element={<Auth />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;
