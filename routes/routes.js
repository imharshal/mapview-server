const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const CardModel = require("../model/card");

const router = express.Router();

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).send({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.email,
        name: req.user.name,
      },
    });
  }
);

router.get(
  "/mapcards",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const cards = await CardModel.find({});
    return res.status(200).send({
      success: true,
      data: cards,
    });
  }
);
module.exports = router;
