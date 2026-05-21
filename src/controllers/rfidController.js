// =========================================
// rfidController.js
// =========================================

const prisma = require("../config/prisma");


// =========================================
// GET ALL RFID TAGS
// =========================================

const getAllRFIDTags = async (
  req,
  res
) => {

  try {

    // =====================================
    // FETCH ALL RFID INVENTORY
    // =====================================

    const rfids =
      await prisma.RFIDMapping.findMany({

        orderBy: {
          slno: "asc",
        },

      });


    // =====================================
    // FORMAT RFID DATA
    // =====================================

    const formattedData =
      rfids.map((tag) => {

        const isMapped =
          tag.phoneNumber &&
          tag.wasteType;


        return {

          slno:
            String(tag.slno)
              .padStart(8, "0"),

          rfid:
            tag.rfid,

          phoneNumber:
            tag.phoneNumber || "NU",

          wasteType:
            tag.wasteType || "NU",

          status:
            isMapped
              ? "MAPPED"
              : "UNMAPPED",

        };

      });


    // =====================================
    // RESPONSE
    // =====================================

    return res.status(200).json({

      success: true,

      message:
        "RFID tags fetched successfully",

      total:
        formattedData.length,

      data:
        formattedData,

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