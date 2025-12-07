import React, { useState } from "react";
import api from "./api/axiosConfig"; // <-- uses baseURL (http://localhost:5000/api/auth)
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // POST /signup -> full URL: http://localhost:5000/api/auth/signup
      const res = await api.post("/signup", form);
      // successful creation -> backend sends 201; navigate to login
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response) {
        // duplicate email or other server messages
        if (err.response.status === 409) {
          setError("Email already in use. Please use a different email.");
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Signup failed (${err.response.status})`);
        }
      } else {
        setError("Signup failed. Check your network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

        {error && (
          <div className="text-red-600 text-sm mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block mb-1 text-gray-600">Full Name</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 chars)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg transition font-semibold ${
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?
          <a href="/" className="text-blue-600 font-semibold ml-1 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
