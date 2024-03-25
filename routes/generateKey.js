const express = require("express");
const { generateAndStoreKey } = require("../controllers/controller");
const router = express.Router();
const { User } = require("../model/db.js");
router.use(express.json());

router.get("/allKeys", async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user by ID and populate the keys field
    const user = await User.findById(userId).populate("keys");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract keys from the user object
    const keys = user.keys;

    res.status(200).json({ keys });
  } catch (error) {
    console.error("Error retrieving keys:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const userId = req.user.userId;
    const uniqueKey = await generateAndStoreKey();
    res.status(200).json({ key: uniqueKey, user: userId });
  } catch (error) {
    console.error("Error generating and storing key:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
