const express = require("express");

const router = express.Router();

const {
  getAllRFIDTags,
} = require("../controllers/rfidController");



// =========================================
// GET ALL RFID TAGS
// =========================================
router.get(
  "/all",
  getAllRFIDTags
);



module.exports = router;