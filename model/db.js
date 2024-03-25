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

// Define the key schema
const keySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  keys: [keySchema], // Embedding keySchema as a subdocument
});

// Create models for User and Key using their respective schemas
const User = mongoose.model("User", userSchema);
const Key = mongoose.model("Key", keySchema);

module.exports = { User, Key };
