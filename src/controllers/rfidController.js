const prisma = require("../config/prisma");



// =========================================
// GET ALL RFID TAGS
// =========================================
const getAllRFIDTags = async (req, res) => {

  try {

    // FETCH RFID MASTER DATA
    const rfids = await prisma.RFIDMapping.findMany({

      orderBy: {
        slno: "asc",
      },

    });

    // FETCH TRACKING LOGS
    const logs = await prisma.TrackingLog.findMany();



    // FORMAT DATA
    const formattedData = rfids.map((rfid) => {

      // DRY MATCH
      const dryMatch = logs.find(

        (log) =>

          log.drySlno &&

          String(log.drySlno).padStart(8, "0") ===
          String(rfid.slno).padStart(8, "0")

      );



      // WET MATCH
      const wetMatch = logs.find(

        (log) =>

          log.wetSlno &&

          String(log.wetSlno).padStart(8, "0") ===
          String(rfid.slno).padStart(8, "0")

      );



      // DRY RFID
      if (dryMatch) {

        return {

          slno: rfid.slno,

          rfid: rfid.rfid,

          phoneNumber:
            dryMatch.phoneNumber || "NU",

          wasteType: "Dry Waste",

          status: "MAPPED",

        };

      }



      // WET RFID
      if (wetMatch) {

        return {

          slno: rfid.slno,

          rfid: rfid.rfid,

          phoneNumber:
            wetMatch.phoneNumber || "NU",

          wasteType: "Wet Waste",

          status: "MAPPED",

        };

      }



      // UNMAPPED RFID
      return {

        slno: rfid.slno,

        rfid: rfid.rfid,

        phoneNumber: "NU",

        wasteType: "NU",

        status: "UNMAPPED",

      };

    });



    return res.status(200).json({

      success: true,

      message:
        "RFID tags fetched successfully",

      total: formattedData.length,

      data: formattedData,

    });

  } catch (error) {

    console.error(
      "RFID Fetch Error:",
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
  getAllRFIDTags,
};