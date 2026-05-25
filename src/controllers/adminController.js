// =========================================
// adminController.js
// =========================================

const prisma = require("../config/prisma");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");


// =========================================
// ADMIN LOGIN
// =========================================

const loginAdmin = async (
  req,
  res
) => {

  try {

    const {
      username,
      password,
    } = req.body;


    // =====================================
    // CHECK EMPTY FIELDS
    // =====================================

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


    // =====================================
    // FIND ADMIN
    // =====================================

    const admin =
      await prisma.Moderator.findFirst({

        where: {
          username,
        },

      });


    // =====================================
    // ADMIN NOT FOUND
    // =====================================

    if (!admin) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid credentials",

      });

    }


    // =====================================
    // CHECK PASSWORD
    // =====================================

    const isMatch =
      await bcrypt.compare(
        password,
        admin.password
      );


    if (!isMatch) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid credentials",

      });

    }


    // =====================================
    // GENERATE JWT TOKEN
    // =====================================

    const token =
      jwt.sign(

        {
          id: admin.id,
          username:
            admin.username,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d",
        }

      );


    // =====================================
    // SUCCESS RESPONSE
    // =====================================

    return res.status(200).json({

      success: true,

      message:
        "Login successful",

      token,

      admin: {

        id: admin.id,

        username:
          admin.username,

      },

    });

  } catch (error) {

    console.error(
      "Admin Login Error:",
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
  loginAdmin,
};