const express = require("express");
const router = express.Router();
const { askAI } = require("../API/askAI.js");
// const { authenticateUser } = require("../controllers/controller.js");
const { User } = require("../model/db.js");
// Endpoint to get CLI commands

router.post("/", async (req, res) => {
  const { key, task } = req.body;

  try {
    // Find the user associated with the provided key
    const user = await User.findOne({ keys: { $elemMatch: { key } } });

    // If user not found or key is invalid
    if (!user) {
      return res.status(401).json({
        error: {
          message: "Authentication failed. Please provide a valid key.",
        },
      });
    }
    console.log("generating the commands waitttttttttt")
    // Authentication successful, proceed with the task

    console.log("the tasks is  : ", task)
    const data = await askAI(task);
    console.log("the data is : ", data)
    data.forEach((element) => {
      console.log(element);
    });
    res.json(data);
  } catch (error) {
    console.log("some error occureddddd while generating commands")
    console.error("Error authenticating user:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
});

module.exports = router;
