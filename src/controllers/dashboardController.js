// =========================================
// dashboardController.js
// =========================================

const prisma = require("../config/prisma");
const isValidRFID = (value) => {

  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  const cleaned =
    String(value)
      .trim()
      .toUpperCase();

  return (
    cleaned !== "NULL" &&
    cleaned !== "N/A" &&
    cleaned !== ""
  );

};

// =========================================
// TOTAL RFID TAGS
// =========================================

const getTotalRFIDTags = async (
  req,
  res
) => {

  try {

    // EVERY RFIDMapping ROW
    // = 1 RFID TAG

    const totalRFIDTags =
      await prisma.RFIDMapping.count();


    return res.status(200).json({

      success: true,

      message:
        "Total RFID tags fetched successfully",

      data: {
        totalRFIDTags,
      },

    });

  } catch (error) {

    console.error(
      "Total RFID Tags Error:",
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

    const logs =
      await prisma.TrackingLog.findMany({

        where: {
          status: "FOUND",
        },

        select: {
          drySlno: true,
          wetSlno: true,
        },

      });


    let distributedTags = 0;


    logs.forEach((log) => {

      if (
        isValidRFID(log.drySlno)
      ) {
        distributedTags++;
      }

      if (
        isValidRFID(log.wetSlno)
      ) {
        distributedTags++;
      }

    });


    return res.status(200).json({

      success: true,

      message:
        "Distributed RFID tags fetched successfully",

      data: {
        distributedTags,
      },

    });

  } catch (error) {

    console.error(
      "Distributed RFID Tags Error:",
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
// ACTIVE WORKERS
// =========================================

const getActiveWorkers = async (
  req,
  res
) => {

  try {

    const activeWorkers =
      await prisma.Moderator.count({

        where: {
          username: {
            not: "",
          },
        },

      });


    return res.status(200).json({

      success: true,

      message:
        "Active workers fetched successfully",

      data: {
        activeWorkers,
      },

    });

  } catch (error) {

    console.error(
      "Active Workers Error:",
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

  // =========================================
// TAGS DISTRIBUTED BY WORKERS
// =========================================

const getTagsDistributedByWorkers =
  async (req, res) => {

    try {

      // =====================================
      // GET ALL WORKERS
      // =====================================

      const workers =
        await prisma.Moderator.findMany({

          select: {
            id: true,
            username: true,
          },

          orderBy: {
            username: "asc",
          },

        });


      // =====================================
      // GET OFFICIAL DISTRIBUTED RFIDS
      // =====================================

      const distributedRFIDs =
        await prisma.RFIDMapping.findMany({

          where: {
            phoneNumber: {
              not: null,
            },
          },

          select: {
            slno: true,
            wasteType: true,
          },

        });


      // =====================================
      // WORKER COUNTS
      // =====================================

      const workerMap = {};


      // =====================================
      // FOR EACH RFID
      // FIND LATEST RESPONSIBLE WORKER
      // =====================================

      for (const rfid of distributedRFIDs) {

        let latestLog = null;


        // DRY RFID

        if (
          rfid.wasteType === "DRY"
        ) {

          latestLog =
            await prisma.TrackingLog.findFirst({

              where: {
                drySlno:
                  rfid.slno,
              },

              orderBy: {
                createdAt:
                  "desc",
              },

            });

        }


        // WET RFID

        if (
          rfid.wasteType === "WET"
        ) {

          latestLog =
            await prisma.TrackingLog.findFirst({

              where: {
                wetSlno:
                  rfid.slno,
              },

              orderBy: {
                createdAt:
                  "desc",
              },

            });

        }


        // COUNT WORKER

        if (
          latestLog &&
          latestLog.workerId
        ) {

          if (
            !workerMap[
              latestLog.workerId
            ]
          ) {

            workerMap[
              latestLog.workerId
            ] = 0;

          }

          workerMap[
            latestLog.workerId
          ]++;

        }

      }


      // =====================================
      // FINAL RESPONSE
      // =====================================

      const tagsByWorker =
        workers.map((worker) => ({

          workerId:
            worker.id,

          username:
            worker.username,

          distributedTags:
            workerMap[
              worker.username
            ] || 0,

        }));


      return res.status(200).json({

        success: true,

        message:
          "Worker distribution fetched successfully",

        data: {
          tagsByWorker,
        },

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
  getActiveWorkers,
  getTagsDistributedByWorkers,
};
      