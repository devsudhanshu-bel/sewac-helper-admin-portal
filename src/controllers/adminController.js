const jwt = require("jsonwebtoken");
const authService = require("../services/authService");
const jwtConfig = require("../config/jwt");

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password required",
      });
    }

    const isValid = await authService.validateAdmin(
      username,
      password
    );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // token
    const token = jwt.sign(
      {
        username: "sewac",
        role: "admin",
      },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  loginAdmin,
};