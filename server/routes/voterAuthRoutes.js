const router = require("express").Router();

const {
  loginVoter,
  verifyOTP
} = require("../controllers/voterAuthController");

/* LOGIN */
router.post("/login", loginVoter);

/* VERIFY OTP */
router.post("/verify-otp", verifyOTP);

module.exports = router;