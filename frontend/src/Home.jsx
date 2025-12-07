// src/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/axiosConfig";

export default function Home({ setToken }) {
  const { useState, useEffect } = React;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear frontend auth
    if (typeof setToken === "function") setToken(null);
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get("/protected"); // GET http://localhost:5000/api/auth/protected
        if (!cancelled) {
          setUser(res.data.user || null);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        if (!cancelled) {
          // if unauthorized, clear token and send user to login
          const status = error?.response?.status;
          if (status === 401 || status === 403) {
            // token invalid/expired
            if (typeof setToken === "function") setToken(null);
            localStorage.removeItem("token");
            navigate("/", { replace: true });
            return;
          }
          setErr("Unable to load profile. Try reloading.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [navigate, setToken]);

  if (loading) return <div className="p-6">Loading profile…</div>;
  if (err) return (
    <div className="p-6">
      <div className="text-red-600 mb-4">{err}</div>
      <button onClick={() => window.location.reload()} className="px-3 py-2 bg-blue-600 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2"> {user?.username || "User"}</h1>
        <p className="text-sm text-gray-600 mb-4">Email: {user?.email}</p>

        {/* More user details if you want */}
        <div className="mb-4">
          <p className="text-sm">User ID: <span className="font-mono text-xs">{user?._id}</span></p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}
  
 
