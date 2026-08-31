// Member 4: Auth Express Routes
const express = require("express");
const { registerUser } = require("../controllers/registerController");
const { loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;

