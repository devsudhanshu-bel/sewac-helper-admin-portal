const prisma = require("../config/prisma");


// =========================================
// GET ALL RFID TAGS
// =========================================

const getAllRFIDTags = async (
  req,
  res
) => {

  try {

    const rfidTags =
      await prisma.RFIDMapping.findMany({

        orderBy: {
          slno: "asc",
        },

      });

    // format response
    const formattedData =
      rfidTags.map((tag) => ({

        slno: tag.slno,

        rfid: tag.rfid,

        phoneNumber:
          tag.phoneNumber || "NU",

        wasteType:
          tag.wasteType || "NU",

        status:
          tag.phoneNumber &&
          tag.wasteType
            ? "MAPPED"
            : "UNMAPPED",

      }));


    return res.status(200).json({

      success: true,

      message:
        "RFID tags fetched successfully",

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