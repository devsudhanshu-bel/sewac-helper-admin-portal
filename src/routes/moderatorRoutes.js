const express =
  require("express");

const router =
  express.Router();

const verifyAdminToken =
  require("../middleware/authMiddleware");

const {

  createModerator,

  getAllModerators,

} = require(
  "../controllers/moderatorController"
);


// =========================================
// CREATE MODERATOR
// =========================================

router.post(
  "/create",
  verifyAdminToken,
  createModerator
);


// =========================================
// GET ALL MODERATORS
// =========================================

router.get(
  "/all",
  verifyAdminToken,
  getAllModerators
);


module.exports =
  router;