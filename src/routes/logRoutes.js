const express =
  require("express");

const router =
  express.Router();

const {
  getLogsSummary,
  getAllLogs,
  getDailyCounts,
} = require(
  "../controllers/logController"
);



// =========================================
// LOG SUMMARY
// =========================================

router.get(
  "/summary",
  getLogsSummary
);


// =========================================
// ALL LOGS
// =========================================

router.get(
  "/all",
  getAllLogs
);

// =========================================
// DAILY DISTRIBUTION COUNTS
// =========================================

router.get(
  "/daily-counts",
  getDailyCounts
);


module.exports =
  router;