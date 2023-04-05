const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { hashSync, compareSync } = require("bcrypt");
const UserModel = require("./model/user");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
const routes = require("./routes/routes");
// Mongoose connection
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (error) => console.log(error));

app.use("/", routes);

app.post("/register", async (req, res) => {
  const userExist = await UserModel.findOne({ email: req.body.email });
  if (!userExist) {
    const user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: hashSync(req.body.password, 10),
    });

    user
      .save()
      .then((user) => {
        res.send({
          success: true,
          message: "User created successfully.",
          user: {
            id: user._id,
            username: user.email,
          },
        });
      })
      .catch((err) => {
        res.send({
          success: false,
          message: "Something went wrong",
          err: err,
        });
      });
  } else {
    res.send({
      success: false,
      message: "Email is already registered",
    });
  }
});

app.post("/login", (req, res) => {
  UserModel.findOne({ email: req.body.username }).then((user) => {
    //No user found
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Could not find the user",
      });
    }

    //Incorrect password
    if (!compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password",
      });
    }

    const payload = {
      username: user.email,
      id: user._id,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).send({
      success: true,
      message: "Logged in successfully!",
      token: "Bearer " + token,
    });
  });
});

require("./config/passport");

app.listen(5000, () => console.log("Listening to port 5000"));
