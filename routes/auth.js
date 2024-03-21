const express = require("express");
const router = express.Router();
const { User } = require("../model/db.js");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken module

router.use(express.json());

// Endpoint to sign up a new user
router.post("/signup", async (req, res) => {
  console.log("inside signup");
  const { name, email, password } = req.body;
  console.log(name, email, password);

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        error: {
          message: "user with this email already exist !",
        },
      });
    }

    // Create a new user
    const keyLength = 16;

    // Generate random key
    const key = crypto.randomBytes(keyLength).toString("hex");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, key });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, "your_secret_key");

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({
      error: {
        message: "Internal server error.",
      },
    });
  }
});

// Endpoint to sign in a user
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "your_secret_key");

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
