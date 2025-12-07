var express = require('express');
var router = express.Router();
const User = require("../models/user"); // file name lowercase
const bcrypt = require("bcryptjs");

// Register page
router.get("/register", (req, res) => {
  res.render("register");
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({ 
      name: req.body.name, 
      email: req.body.email, 
      password: hashedPassword 
    });
    res.redirect("/users/login");
  } catch (err) {
    res.send("Error: " + err);
  }
});

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Incorrect password");

  // IMPORTANT: session me user set karna
  req.session.user = user; 
  res.redirect("/dashboard");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/users/login");
  });
});

module.exports = router;
