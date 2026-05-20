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

    const formattedLogs =
      logs.map((log) => {

        let action =
          "UNKNOWN";

        let wasteType =
          "NU";

        let rfidTag =
          "-";


        // =====================================
        // FOUND = DISTRIBUTED
        // =====================================

        if (
          log.status === "FOUND"
        ) {

          action =
            "DISTRIBUTED";


          // DRY RFID
          if (log.drySlno) {

            wasteType =
              "Dry Waste";

            rfidTag =
              log.drySlno;

          }

          // WET RFID
          else if (log.wetSlno) {

            wasteType =
              "Wet Waste";

            rfidTag =
              log.wetSlno;

          }

        }


        // =====================================
        // NOT FOUND
        // =====================================

        if (
          log.status ===
          "NOT_FOUND"
        ) {

          action =
            "NOT_FOUND";

          rfidTag = "-";

        }


        return {

          id: log.id,

          time:
            log.createdAt,

          worker:
            log.workerId || "NU",

          action,

          wasteType,

          rfidTag,

          citizenName:
            log.citizenName || "NU",

          phoneNumber:
            log.phoneNumber || "NU",

          remarks:
            log.remarks || "NU",

          status:
            log.status,

        };

      });

    return res.status(200).json({

      success: true,

      message:
        "Logs fetched successfully",

      total:
        formattedLogs.length,

      data:
        formattedLogs,

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