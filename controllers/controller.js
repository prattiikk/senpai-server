const { User } = require("../model/db.js");
const crypto = require("crypto");
const { Key } = require("../model/db.js");
// Example user authentication function
const authenticateUser = async (userid, password) => {
  try {
    const user = await User.findOne({ username: userid, password: password });
    return !!user;
  } catch (error) {
    throw error;
  }
};

// Function to generate a unique key and store it in the database
async function generateAndStoreKey() {
  try {
    // Generate a unique key
    const keyLength = 32; // Specify the desired length of the key
    const uniqueKey = crypto.randomBytes(keyLength).toString("hex");

    // Check if the generated key already exists in the database
    const existingKey = await Key.findOne({ key: uniqueKey });

    // If the key already exists, generate a new one
    if (existingKey) {
      return generateAndStoreKey();
    }

    // Create a new key document
    const newKey = new Key({
      key: uniqueKey,
    });

    // Save the new key document to the database
    await newKey.save();

    return uniqueKey;
  } catch (error) {
    console.error("Error generating and storing key:", error);
    throw error;
  }
}

module.exports = {
  authenticateUser,
  generateAndStoreKey,
};
