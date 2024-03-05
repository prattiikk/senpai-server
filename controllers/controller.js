const { User } = require("../model/db.js");

// Example user authentication function
const authenticateUser = async (userid, password) => {
  try {
    const user = await User.findOne({ username: userid, password: password });
    return !!user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  authenticateUser,
};
