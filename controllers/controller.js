const { User } = require("../model/db.js");

// Example user authentication function
const authenticateUser = async (key) => {
  try {
    const user = await User.findOne({ key: key });
    return !!user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  authenticateUser,
};
