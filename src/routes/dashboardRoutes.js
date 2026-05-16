const express = require("express");

const router = express.Router();

const dashboardController =
  require("../controllers/dashboardController");

const verifyAdminToken =
  require("../middleware/authMiddleware");


/*
|--------------------------------------------------------------------------
| CARD 1 → TOTAL RFID TAGS
|--------------------------------------------------------------------------
*/

router.get(
  "/total-rfid-tags",
  verifyAdminToken,
  dashboardController.getTotalRFIDTags
);


/*
|--------------------------------------------------------------------------
| CARD 2 → DISTRIBUTED TAGS
|--------------------------------------------------------------------------
*/

router.get(
  "/distributed-tags",
  verifyAdminToken,
  dashboardController.getDistributedTags
);


module.exports = router;