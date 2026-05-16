const prisma = require("../config/prisma");

/*
|--------------------------------------------------------------------------
| CARD 1 → TOTAL RFID TAGS
|--------------------------------------------------------------------------
| Counts all valid slno entries
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| CARD 2 → DISTRIBUTED TAGS
|--------------------------------------------------------------------------
| Logic:
| 1 phone number = 2 RFID serial numbers distributed
|
| Example:
| 8123282676 → slno1 + slno2
|
| So:
| distributedTags = assigned RFID rows / 2
|--------------------------------------------------------------------------
*/

const getDistributedTags = async (
  req,
  res
) => {

  try {

    /*
    |--------------------------------------------------------------------------
    | COUNT ALL RFID TAGS
    | WHERE phoneNumber EXISTS
    |--------------------------------------------------------------------------
    */

    const distributedTags =
      await prisma.RFIDMapping.count({
        where: {
          AND: [
            {
              phoneNumber: {
                not: null,
              },
            },
            {
              phoneNumber: {
                not: "",
              },
            },
          ],
        },
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


module.exports = {
  getTotalRFIDTags,
  getDistributedTags,
};