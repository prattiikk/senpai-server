const express = require("express");
const { generateAndStoreKey } = require("../controllers/controller");
const router = express.Router();

router.use(express.json());

router.post("/generate", async (req, res) => {
  try {
    const uniqueKey = await generateAndStoreKey();
    res.status(200).json({ key: uniqueKey });
  } catch (error) {
    console.error("Error generating and storing key:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
