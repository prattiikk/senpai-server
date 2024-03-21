const express = require("express");
const router = express.Router();
const { askAI } = require("../API/askAI.js");
const { authenticateUser } = require("../controllers/controller.js");

// Endpoint to get CLI commands
router.post("/", async (req, res) => {
  const { key, task } = req.body;

  // Authenticate the user
  const isAuthenticated = await authenticateUser(key);
  if (!isAuthenticated) {
    return res.status(401).json({
      error: {
        message: "Authentication failed. Please provide valid credentials.",
      },
    });
  }

  const data = await askAI(task);
  // console.log("inside post");
  // data.forEach((element) => {
  //   console.log(element);
  // });
  res.json(data);
});

module.exports = router;
