const bcrypt = require("bcryptjs");

// HARDCODED ADMIN
const ADMIN = {
  username: "sewac",

  // bcrypt hash for: admin@sewac2026
  password:
    "$2b$10$hI5pQ3zxl7/OkIIPlqYcrO4L80Ol0afmsK.FaR5SDD/xWzMbVcc4y",
};

const validateAdmin = async (username, password) => {
  if (username !== ADMIN.username) {
    return false;
  }

  const isMatch = await bcrypt.compare(password, ADMIN.password);

  return isMatch;
};

module.exports = {
  validateAdmin,
};