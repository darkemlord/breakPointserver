const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

/* GET users listing. */
router.get("/", function (_req, res) {
  res.send("listening");
});

router.post("/", async (req, res) => {
  const { name, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, password: hashedPassword, email });
  const token = jwt.sign(
    { name: newUser.name, email: newUser.email },
    process.env.SECRET,
    {
      expiresIn: "24h",
    }
  );
  newUser.save((err, user) => {
    if (err && err.code === 11000)
      return res.json({
        error: `User ${req.body.email} already exist`,
      });
    if (err) return res.json({ error: err });
    res.json({ message: `User ${user.name} Saved Succesfully`, token });
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      error: "user or password are invalid",
    });
  }
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    return res.status(401).send({
      error: "user or password are invalid",
    });
  }
  const token = jwt.sign({ id: user.id, name: user.name }, process.env.SECRET);
  res.json({ token });
});

router.put("/:id/password", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(id, {
    password: hashedPassword,
  });
  if (!user) return res.json({ error: "can't find the user" });
  res.json({
    message: "Password updated successfully",
  });
});

module.exports = router;
