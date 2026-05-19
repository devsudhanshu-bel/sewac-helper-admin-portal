const prisma = require("../config/prisma");



// =========================================
// GET ALL RFID TAGS
// =========================================
const getAllRFIDTags = async (req, res) => {

  try {

    // =========================================
    // STEP 1 → FETCH ALL RFID TAGS
    // =========================================
    const rfids = await prisma.RFIDMapping.findMany({

      orderBy: {
        slno: "asc",
      },

    });



    // =========================================
    // STEP 2 → FETCH TRACKING LOGS
    // =========================================
    const logs = await prisma.TrackingLog.findMany();



    // =========================================
    // STEP 3 → FORMAT RFID DATA
    // =========================================
    const formattedData = rfids.map((rfid) => {

      // =========================================
      // DRY RFID MATCH
      // RFIDMapping.slno ↔ TrackingLog.drySlno
      // =========================================
      const dryMatch = logs.find(

        (log) =>
          log.drySlno &&
          log.drySlno === rfid.slno

      );



      // =========================================
      // WET RFID MATCH
      // RFIDMapping.slno ↔ TrackingLog.wetSlno
      // =========================================
      const wetMatch = logs.find(

        (log) =>
          log.wetSlno &&
          log.wetSlno === rfid.slno

      );



      // =========================================
      // DRY RFID FOUND
      // =========================================
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



      // =========================================
      // WET RFID FOUND
      // =========================================
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



      // =========================================
      // UNMAPPED RFID
      // =========================================
      return {

        slno: rfid.slno,

        rfid: rfid.rfid,

        phoneNumber: "NU",

        wasteType: "NU",

        status: "UNMAPPED",

      };

    });



    // =========================================
    // RESPONSE
    // =========================================
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