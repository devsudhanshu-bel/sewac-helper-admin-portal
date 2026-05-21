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

    // FETCH MASTER CITIZEN DATA

    const citizens =
      await prisma.MasterCitizenData.findMany({

        orderBy: {
          id: "asc",
        },

      });


    const formattedData = [];


    citizens.forEach((citizen) => {

      // =====================================
      // BOTH DRY + WET
      // =====================================

      if (
        citizen.drySlno &&
        citizen.dryRFID
      ) {

        formattedData.push({

          slno:
            citizen.drySlno,

          rfid:
            citizen.dryRFID,

          phoneNumber:
            citizen.contactNumber || "NULL",

          wasteType:
            "Dry Waste",

          status:
            "MAPPED",

        });

      }


      if (
        citizen.wetSlno &&
        citizen.wetRFID
      ) {

        formattedData.push({

          slno:
            citizen.wetSlno,

          rfid:
            citizen.wetRFID,

          phoneNumber:
            citizen.contactNumber || "NULL",

          wasteType:
            "Wet Waste",

          status:
            "MAPPED",

        });

      }


      // =====================================
      // UNMAPPED
      // =====================================

      if (
        !citizen.drySlno &&
        !citizen.wetSlno
      ) {

        formattedData.push({

          slno:
            "NULL",

          rfid:
            "NULL",

          phoneNumber:
            "NULL",

          wasteType:
            "NULL",

          status:
            "UNMAPPED",

        });

      }

    });


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