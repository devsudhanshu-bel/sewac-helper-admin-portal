const express = require("express");

const router = express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const {

  getTotalRFIDTags,

  getDistributedTags,

  getActiveWorkers,

  getTagsDistributedByWorkers,

} = require(
  "../controllers/dashboardController"
);


// =========================================
// TOTAL RFID TAGS
// =========================================

router.get(
  "/total-rfid-tags",
  verifyToken,
  getTotalRFIDTags
);


// =========================================
// DISTRIBUTED TAGS
// =========================================

router.get(
  "/distributed-tags",
  verifyToken,
  getDistributedTags
);


// =========================================
// ACTIVE WORKERS
// =========================================

router.get(
  "/active-workers",
  verifyToken,
  getActiveWorkers
);


// =========================================
// TAGS DISTRIBUTED BY WORKERS
// =========================================

router.get(
  "/worker-distribution",
  verifyToken,
  getTagsDistributedByWorkers
);


module.exports = router;