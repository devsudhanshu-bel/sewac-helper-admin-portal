const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

const verifyAdminToken = require("../middleware/authMiddleware");

// LOGIN
router.post("/login", adminController.loginAdmin);

// PROTECTED TEST ROUTE
router.get(
  "/dashboard",
  verifyAdminToken,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome Admin",
      admin: req.admin,
    });
  }
);

module.exports = router;