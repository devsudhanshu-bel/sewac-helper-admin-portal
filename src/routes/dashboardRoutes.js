const express = require("express");

const router = express.Router();

const dashboardController =
  require("../controllers/dashboardController");

const verifyAdminToken =
  require("../middleware/authMiddleware");

/*
|--------------------------------------------------------------------------
| TOTAL RFID TAGS CARD
|--------------------------------------------------------------------------
*/

router.get(
  "/total-rfid-tags",
  verifyAdminToken,
  dashboardController.getTotalRFIDTags
);

module.exports = router;