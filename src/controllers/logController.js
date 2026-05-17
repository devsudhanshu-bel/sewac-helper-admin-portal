const prisma = require("../config/prisma");


// =========================================
// LOG SUMMARY
// =========================================

const getLogsSummary = async (
  req,
  res
) => {

  try {

    // total logs
    const totalLogs =
      await prisma.TrackingLog.count();

    // today's date
    const today =
      new Date();

    today.setHours(0, 0, 0, 0);

    // today's logs
    const todayLogs =
      await prisma.TrackingLog.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

    // active workers
    const activeWorkers =
      await prisma.TrackingLog.groupBy({
        by: ["workerId"],
        where: {
          workerId: {
            not: null,
          },
        },
      });

    // latest log
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

        if (
          log.status ===
          "FOUND"
        ) {

          action =
            "DISTRIBUTED";

        }

        if (
          log.status ===
          "NOT_FOUND"
        ) {

          action =
            "NOT_FOUND";

        }

        return {

          id: log.id,

          time:
            log.createdAt,

          worker:
            log.workerId,

          action,

          rfidTag:
            log.wetSlno ||
            log.drySlno ||
            "-",

          citizenName:
            log.citizenName,

          phoneNumber:
            log.phoneNumber,

          status:
            log.status,
        };

      });

    return res.status(200).json({

      success: true,

      message:
        "Logs fetched successfully",

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