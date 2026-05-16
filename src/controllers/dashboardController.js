const prisma = require("../config/prisma");

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

module.exports = {
  getTotalRFIDTags,
};