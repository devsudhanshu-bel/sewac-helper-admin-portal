const express = require("express");

const router = express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const {
  getTotalRFIDTags,
  getDistributedTags,
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
// TAGS DISTRIBUTED BY WORKERS
// =========================================

router.get(
  "/worker-distribution",
  verifyToken,
  getTagsDistributedByWorkers
);


module.exports = router;