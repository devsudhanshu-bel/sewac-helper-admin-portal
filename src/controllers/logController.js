// =========================================
// logController.js
// =========================================

const prisma = require("../config/prisma");


// =========================================
// LOG SUMMARY
// =========================================

const getLogsSummary = async (req, res) => {

  try {

    const totalLogs =
      await prisma.TrackingLog.count();

    const today =
      new Date();

    today.setHours(0, 0, 0, 0);

    const todayLogs =
      await prisma.TrackingLog.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

    const activeWorkers =
      await prisma.Moderator.count({
        where: {
          username: {
            not: "sewac",
          },
        },
      });

    const latestLog =
      await prisma.TrackingLog.findFirst({
        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({

      success: true,

      message:
        "Logs summary fetched successfully",

      data: {

        totalLogs,

        todayLogs,

        activeWorkers,

        latestLog:
          latestLog?.createdAt || null,

      },

    });

  } catch (error) {

    console.error(
      "Logs Summary Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Internal server error",

    });

  }

};

// =========================================
// ALL LOGS
// =========================================

const getAllLogs = async (
  req,
  res
) => {

  try {

    // Parse query params
    let limit = parseInt(req.query.limit) || 100;
    let page = parseInt(req.query.page) || 1;
    const status = req.query.status; // "FOUND" or "NOT_FOUND"
    const action = req.query.action; // "DISTRIBUTED" or "NOT_FOUND"

    // Allow fetching all with limit=-1
    if (limit === -1) limit = 999999;
    if (limit < 1) limit = 100;
    if (page < 1) page = 1;

    const skip = (page - 1) * limit;

    // Build where clause based on action/status
    let whereClause = {};
    if (action === "DISTRIBUTED" || status === "FOUND") {
      whereClause.status = "FOUND";
    } else if (action === "NOT_FOUND" || status === "NOT_FOUND") {
      whereClause.status = "NOT_FOUND";
    }
    // If no filter, return all

    // Fetch total count for pagination
    const totalCount = await prisma.TrackingLog.count({
      where: whereClause,
    });

    const logs =
      await prisma.TrackingLog.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: skip,
      });

    const formattedLogs = [];

    logs.forEach((log) => {

      // =====================================
      // DRY RFID (DISTRIBUTED)
      // =====================================

      if (log.drySlno) {

        formattedLogs.push({

          id: `${log.id}-dry`,

          time: log.createdAt,

          worker: log.workerId || "NU",

          action: "DISTRIBUTED",

          wasteType: "Dry Waste",

          rfidTag: log.drySlno,

          phoneNumber:
            log.phoneNumber || "NU",

          citizenName:
            log.citizenName || "NU",

          remarks:
            log.remarks || "NU",

          status:
            log.status,

        });

      }

      // =====================================
      // WET RFID (DISTRIBUTED)
      // =====================================

      if (log.wetSlno) {

        formattedLogs.push({

          id: `${log.id}-wet`,

          time: log.createdAt,

          worker: log.workerId || "NU",

          action: "DISTRIBUTED",

          wasteType: "Wet Waste",

          rfidTag: log.wetSlno,

          phoneNumber:
            log.phoneNumber || "NU",

          citizenName:
            log.citizenName || "NU",

          remarks:
            log.remarks || "NU",

          status:
            log.status,

        });

      }

      // =====================================
      // NO RFID FOUND / NOT_FOUND
      // =====================================

      if (
        !log.drySlno &&
        !log.wetSlno
      ) {

        formattedLogs.push({

          id: log.id,

          time: log.createdAt,

          worker: log.workerId || "NU",

          action:
            log.status === "NOT_FOUND"
              ? "NOT_FOUND"
              : "SCANNED",

          wasteType: "N/A",

          rfidTag: "N/A",

          phoneNumber:
            log.phoneNumber || "NU",

          citizenName:
            log.citizenName || "NU",

          remarks:
            log.remarks || "NU",

          status:
            log.status,

        });

      }

    });

    return res.status(200).json({

      success: true,

      message:
        "Logs fetched successfully",

      total: totalCount,

      pageSize: limit,

      currentPage: page,

      totalPages: Math.ceil(totalCount / limit),

      data: formattedLogs,

    });

  } catch (error) {

    console.error(
      "Get Logs Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Internal server error",

    });

  }

};


module.exports = {
  getLogsSummary,
  getAllLogs,
};