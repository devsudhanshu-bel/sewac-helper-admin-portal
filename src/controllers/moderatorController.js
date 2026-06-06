const prisma =
  require("../config/prisma");

const bcrypt =
  require("bcryptjs");


// =========================================
// CREATE MODERATOR
// =========================================

const createModerator = async (
  req,
  res
) => {

  try {

    const {
      username,
      password,
    } = req.body;


    if (
      !username ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Username and password are required",

      });

    }


    const existingModerator =
      await prisma.Moderator.findUnique({

        where: {
          username,
        },

      });


    if (
      existingModerator
    ) {

      return res.status(409).json({

        success: false,

        message:
          "Username already exists",

      });

    }


    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    const moderator =
      await prisma.Moderator.create({

        data: {

          username,

          password:
            hashedPassword,

        },

      });


    return res.status(201).json({

      success: true,

      message:
        "Moderator created successfully",

      data: {

        id:
          moderator.id,

        username:
          moderator.username,

        role:
          moderator.role,

      },

    });

  } catch (error) {

    console.error(
      "Create Moderator Error:",
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
// GET ALL MODERATORS
// =========================================

const getAllModerators = async (
  req,
  res
) => {

  try {

    const moderators =
      await prisma.Moderator.findMany({

        select: {

          id: true,

          username: true,

          role: true,

          createdAt: true,

        },

        orderBy: {

          username: "asc",

        },

      });


    return res.status(200).json({

      success: true,

      message:
        "Moderators fetched successfully",

      total:
        moderators.length,

      data:
        moderators,

    });

  } catch (error) {

    console.error(
      "Get Moderators Error:",
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

  createModerator,

  getAllModerators,

};