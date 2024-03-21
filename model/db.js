const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// <--------------------------------- key -------------------------------->

// Define the schema for the key model
const keySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
const Key = mongoose.model("Key", keySchema);

module.exports = { User, Key };
