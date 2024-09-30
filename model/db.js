const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
});
const User = mongoose.model("User", userSchema);

module.exports = { User };
