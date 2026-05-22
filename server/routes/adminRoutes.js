const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware")
const { getStats } = require("../controllers/adminController");

const {
  registerAdmin,
  loginAdmin
} = require("../controllers/adminController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/stats", auth, getStats);

module.exports = router;