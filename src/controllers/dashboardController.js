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
            not: "sewac",
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

const workers =
  await prisma.Moderator.findMany({

    where: {
      username: {
        not: "sewac",
      },
    },

    select: {
      id: true,
      username: true,
    },

    orderBy: {
      username: "asc",
    },

  });

const workerMap = {};
// =====================================
// INITIALIZE ALL WORKERS
// =====================================

workers.forEach((worker) => {

  workerMap[
    worker.username
  ] = 0;

});


// =====================================
// FETCH ALL FOUND LOGS
// =====================================

const logs =
  await prisma.TrackingLog.findMany({

    where: {
      status: "FOUND",
    },

    select: {

      workerId: true,

      drySlno: true,

      wetSlno: true,

    },

  });


// =====================================
// COUNT RFIDS PER WORKER
// =====================================

logs.forEach((log) => {

  if (
    !log.workerId ||
    !workerMap.hasOwnProperty(
      log.workerId
    )
  ) {
    return;
  }


  if (
    isValidRFID(
      log.drySlno
    )
  ) {

    workerMap[
      log.workerId
    ]++;

  }


  if (
    isValidRFID(
      log.wetSlno
    )
  ) {

    workerMap[
      log.workerId
    ]++;

  }

});


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
      