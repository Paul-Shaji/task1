
const express = require("express")
const router = express.Router()
const { signup , login ,getProfile} = require("../controllers/authController")
const authMiddleware = require("../middleware/auth")

router.post("/signup",signup)
router.post("/login",login)

router.get("/protected", authMiddleware, getProfile);


module.exports = router;