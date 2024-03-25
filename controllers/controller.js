const { User } = require("../model/db.js");
const crypto = require("crypto");

// const authenticateUser = async (userid, password) => {
//   try {
//     const user = await User.findOne({ username: userid, password: password });
//     return !!user;
//   } catch (error) {
//     throw error;
//   }
// };

// Function to generate a unique key and store it in the database
async function generateAndStoreKey(userId) {
  try {
    // Generate a unique key
    const keyLength = 16; // Specify the desired length of the key
    const uniqueKey = crypto.randomBytes(keyLength).toString("hex");

    // Check if the generated key already exists in the database
    const existingUser = await User.findById(userId);
    console.log("user before generating : ", existingUser);

    if (!existingUser) {
      throw new Error("User not found here inside keyGenerator");
    }

    // Check if the generated key already exists in the user's keys array
    const keyExists = existingUser.keys.some((key) => key.key === uniqueKey);

    // If the key already exists, generate a new one
    if (keyExists) {
      return generateAndStoreKey(userId); // Recursively generate a new key
    }

    // Add the new key to the user's keys array
    existingUser.keys.push({ key: uniqueKey });

    // Save the updated user document to the database
    await existingUser.save();

    return uniqueKey;
  } catch (error) {
    console.error("Error generating and storing key:", error);
    throw error;
  }
}

module.exports = {
  // authenticateUser,
  generateAndStoreKey,
};
