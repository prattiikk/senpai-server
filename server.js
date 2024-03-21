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
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization;
    console.log(token);
    // Check if the Authorization header is present
    if (token) {
      // Split the header value to extract the token
      // const token = authHeader.split(" ")[1];

      // Retrieve the secret key from environment variables
      const secretKey = process.env.SEC_KEY;

      // Verify the token using the secret key
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          // If token verification fails, send a 403 Forbidden response
          return res
            .status(403)
            .json({ message: "Failed to authenticate token" });
        } else {
          // If token is valid, attach the user object to the request and proceed to the next middleware
          req.user = user;
          next();
        }
      });
    } else {
      // If Authorization header is missing, send a 401 Unauthorized response
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    // If an error occurs, send a 500 Internal Server Error response
    console.error("Error authenticating JWT:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

app.use("/auth", authRoutes);
app.use("/getcommands", commandRoutes);
app.use("/key", authenticateJWT, keyRoute);

const port = process.env.PORT || 3300;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
