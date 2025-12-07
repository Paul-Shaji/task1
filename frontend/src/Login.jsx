import React, { useState } from "react";
import api from "./api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Submitting login:", form);

    try {
      // POST /login -> http://localhost:5000/api/auth/login
      const res = await api.post("/login", form);
      console.log("Login response:", res.data);

      const token = res.data?.token;
      if (!token) {
        setError("Login failed: server did not return a token.");
        setLoading(false);
        return;
      }

      // update parent state and localStorage
      if (typeof setToken === "function") setToken(token);
      localStorage.setItem("token", token);

      // navigate to protected home
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        const msg = err.response.data?.message || err.response.data?.error || "Login failed";
        setError(msg);
      } else {
        setError("Login failed. Check your network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <div className="text-red-600 mb-3 text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 rounded-lg transition ${
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Don't have an account?
          <a href="/signup" className="text-blue-600 font-semibold ml-1 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
