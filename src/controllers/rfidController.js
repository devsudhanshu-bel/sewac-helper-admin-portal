const prisma = require("../config/prisma");

const getAllRFIDTags = async (req, res) => {
  try {

    // STEP 1 → Fetch all RFID master tags
    const rfids = await prisma.RFIDMapping.findMany({
      orderBy: {
        slno: "asc",
      },
    });

    // STEP 2 → Fetch all tracking logs
    const logs = await prisma.TrackingLog.findMany();

    // STEP 3 → Merge mapping info
    const formattedData = rfids.map((rfid) => {

      // DRY MATCH
      const dryMatch = logs.find(
        (log) => log.slno === rfid.slno
      );

      // WET MATCH
      const wetMatch = logs.find(
        (log) => log.wetSlno === rfid.slno
      );

      // DRY RFID FOUND
      if (dryMatch) {
        return {
          slno: rfid.slno,
          rfid: rfid.rfid,
          phoneNumber: dryMatch.phoneNumber || "NU",
          wasteType: "Dry Waste",
          status: "MAPPED",
        };
      }

      // WET RFID FOUND
      if (wetMatch) {
        return {
          slno: rfid.slno,
          rfid: rfid.rfid,
          phoneNumber: wetMatch.phoneNumber || "NU",
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
      message: "RFID tags fetched successfully",
      data: formattedData,
    });

  } catch (error) {

    console.error("RFID Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllRFIDTags,
};