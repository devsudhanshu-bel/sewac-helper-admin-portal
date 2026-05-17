const express =
  require("express");

const router =
  express.Router();

const {
  getLogsSummary,
  getAllLogs,
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


module.exports =
  router;