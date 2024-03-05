const express = require("express");
const router = express.Router();
const { User } = require("../model/db.js");

router.use(express.json());

// Endpoint to sign up a new user
router.post("/", async (req, res) => {
  const { username, password, name, email } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({
        error: {
          message: "Username already exists. Please choose a different one.",
        },
      });
    }

    // Create a new user
    const newUser = new User({ username, password, name, email });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: "Internal server error.",
      },
    });
  }
});

module.exports = router;
