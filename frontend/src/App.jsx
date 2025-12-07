// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import api from "./api/axiosConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function AuthVerifier({ token, setToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (!token) return; // nothing to verify
      try {
        await api.get("/protected"); // hits: GET http://localhost:5000/api/auth/protected
        if (!cancelled) navigate("/home", { replace: true });
      } catch (err) {
        console.warn("Token verification failed:", err?.response?.data || err);
        if (!cancelled) setToken(null);
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [token, setToken, navigate]);

  return null;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // keep localStorage and state in sync
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  return (
    <>
    <Router>
      <AuthVerifier token={token} setToken={setToken} />

      <Routes>
        {/* Always render Login at root; Login receives setToken to update App state */}
        <Route path="/" element={<Login setToken={setToken} />} />

        <Route path="/signup" element={<Signup />} />

        {/* Protect /home on client side: only render if token present */}
        <Route path="/home" element={token ? <Home setToken={setToken} /> : <Navigate to="/" replace />} />

        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </>
  );
}

export default App;
