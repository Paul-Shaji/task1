const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "mysecret";

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Malformed token" });

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
