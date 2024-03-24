const express = require("express");
const { generateAndStoreKey } = require("../controllers/controller");
const router = express.Router();
const { Key } = require("../model/db.js");
router.use(express.json());

router.get("/allKeys", async (req, res) => {
  try {
    // Assuming you extract the user ID from the JWT token
    const userId = req.user.id; // Adjust this according to your actual implementation

    // Find all keys associated with the user
    const keys = await Key.find({ user: userId });

    res.status(200).json({ keys });
  } catch (error) {
    console.error("Error retrieving keys:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("user inside the generate is -> ", userId);
    const uniqueKey = await generateAndStoreKey();
    res.status(200).json({ key: uniqueKey, user: userId });
  } catch (error) {
    console.error("Error generating and storing key:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
