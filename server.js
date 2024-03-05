const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require('./routes/userSignUp.js');
const commandRoutes = require('./routes/getCommands.js');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());








app.use('/signup', authRoutes);
app.use('/getcommands', commandRoutes);



const port = process.env.PORT || 3300;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
