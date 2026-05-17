const express = require("express");

const router = express.Router();

const {
  getAllRFIDTags,
} = require(
  "../controllers/rfidController"
);

const verifyToken = require(
  "../middleware/authMiddleware"
);


// =========================================
// RFID TAGS LIST
// =========================================

router.get(
  "/all",
  verifyToken,
  getAllRFIDTags
);


module.exports = router;