const prisma = require("../config/prisma");


// =========================================
// TOTAL RFID TAGS
// =========================================

const getTotalRFIDTags = async (
  req,
  res
) => {

  try {

    const totalTags =
      await prisma.RFIDMapping.count({
        where: {
          slno: {
            not: "",
          },
        },
      });

    return res.status(200).json({
      success: true,
      message:
        "Total RFID tags fetched successfully",

      data: {
        totalRFIDTags: totalTags,
      },
    });

  } catch (error) {

    console.error(
      "RFID Count Error:",
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
// DISTRIBUTED RFID TAGS
// =========================================

const getDistributedTags = async (
  req,
  res
) => {

  try {

    const distributedRows =
      await prisma.RFIDMapping.count({
        where: {
          phoneNumber: {
            not: null,
          },
        },
      });

    return res.status(200).json({
      success: true,
      message:
        "Distributed RFID tags fetched successfully",

      data: {
        distributedTags:
          distributedRows,
      },
    });

  } catch (error) {

    console.error(
      "Distributed Tags Error:",
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
// TAGS DISTRIBUTED BY WORKERS
// =========================================

const getTagsDistributedByWorkers =
  async (req, res) => {

    try {

      // get all workers
      const workers =
        await prisma.Moderator.findMany({
          select: {
            username: true,
          },
          orderBy: {
            username: "asc",
          },
        });

      // get tracking logs
      const trackingLogs =
        await prisma.TrackingLog.groupBy({
          by: ["workerId"],

          _count: {
            workerId: true,
          },
        });

      // map counts
      const workerDistribution =
        workers.map((worker) => {

          const matchedWorker =
            trackingLogs.find(
              (log) =>
                log.workerId ===
                worker.username
            );

          const distributedCount =
            matchedWorker
              ? matchedWorker._count
                  .workerId * 2
              : 0;

          return {
            worker:
              worker.username,

            distributedTags:
              distributedCount,
          };

        });

      return res.status(200).json({
        success: true,

        message:
          "Worker distribution fetched successfully",

        data: workerDistribution,
      });

    } catch (error) {

      console.error(
        "Worker Distribution Error:",
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
  getTotalRFIDTags,
  getDistributedTags,
  getTagsDistributedByWorkers,
};