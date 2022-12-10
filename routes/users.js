const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("listening");
});

router.post("/", (req, res) => {
  const userData = req.body;
  const newUser = new User(userData);
  newUser.save((err, user) => {
    if (err && err.code === 11000)
      return res.json({
        error: `User ${req.body.email} already exist`,
      });
    if (err) return res.json({ error: err });
    res.json({ message: `User ${user.name} Saved Succesfully` });
  });
});

module.exports = router;
