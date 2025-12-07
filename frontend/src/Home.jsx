// src/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/axiosConfig";

export default function Home({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear frontend auth
    if (typeof setToken === "function") setToken(null);
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  // optional: fetch user info to prove token works
  const fetchProfile = async () => {
    try {
      const res = await api.get("/protected"); // returns userId if your backend does
      console.log("protected response:", res.data);
    } catch (err) {
      console.error("fetchProfile error", err);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
      <p className="mb-4">You are logged in.</p>
      <div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
