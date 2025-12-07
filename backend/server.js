require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const connectDB = require("./db/db");
const authMiddleware = require("./middleware/auth"); // <-- use middleware, NOT routes

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// connect DB
connectDB();

// auth routes: /api/auth/signup, /api/auth/login, etc.
app.use("/api/auth", authRoutes);

// Protected route (for token verification)
// Full URL: GET http://localhost:5000/api/auth/protected
app.get("/api/auth/protected", authMiddleware, (req, res) => {
  res.json({ message: "You accessed a protected route", userId: req.userId });
});

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
