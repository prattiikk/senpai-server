const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/auth.js");
const commandRoutes = require("./routes/getCommands.js");
const keyRoute = require("./routes/generateKey.js");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization;
  const secretKey = process.env.SEC_KEY;
  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Failed to authenticate token" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

app.use("/auth", authRoutes);
app.use("/getcommands", commandRoutes);
app.use("/key", authenticateJWT, keyRoute);

const port = process.env.PORT || 3300;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
