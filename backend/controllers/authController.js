const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET_KEY = process.env.SECRET_KEY || "mysecret";

// Signup controller
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fast pre-check (not a replacement for unique index)
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashed,
    });

    await user.save();
    return res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Signup error:", err);
    // Handle duplicate-key from Mongo (race condition)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ message: "Email already in use" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Support login by email OR username (you can choose one)
    const query = email ? { email } : { username };
    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT
    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
