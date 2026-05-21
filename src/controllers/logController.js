// =========================================
// logController.js
// =========================================

const prisma = require("../config/prisma");


// =========================================
// LOG SUMMARY
// =========================================

const getLogsSummary = async (
  req,
  res
) => {

  try {

    // TOTAL LOGS

    const totalLogs =
      await prisma.TrackingLog.count();


    // TODAY DATE

    const today =
      new Date();

    today.setHours(0, 0, 0, 0);


    // TODAY LOGS

    const todayLogs =
      await prisma.TrackingLog.count({

        where: {
          createdAt: {
            gte: today,
          },
        },

      });


    // ACTIVE WORKERS

    const activeWorkers =
      await prisma.TrackingLog.groupBy({

        by: ["workerId"],

        where: {
          workerId: {
            not: null,
          },
        },

      });


    // LATEST LOG

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

        activeWorkers:
          activeWorkers.length,

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

    const logs =
      await prisma.TrackingLog.findMany({

        orderBy: {
          createdAt: "desc",
        },

      });


const formattedLogs = [];

logs.forEach((log) => {

  // =====================================
  // DRY RFID
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
  // WET RFID
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
  // NO RFID FOUND
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