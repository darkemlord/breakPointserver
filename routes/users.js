const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("listening");
});

router.post("/", (req, res) => {
  const userData = req.body;
  const newUser = new User(userData);
  const { name, email } = newUser;
  const token = jwt.sign({ name, email }, process.env.SECRET, {
    expiresIn: "24h",
  });
  newUser.save((err, user) => {
    if (err && err.code === 11000)
      return res.json({
        error: `User ${req.body.email} already exist`,
      });
    if (err) return res.json({ error: err });
    res.json({ message: `User ${user.name} Saved Succesfully`, token });
  });
});

module.exports = router;
