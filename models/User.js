var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Game = require('../models/Game');

/* Middleware to protect routes */
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/users/login");
  }
}

/* -------- Register -------- */
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();
  res.redirect('/users/login');
});

/* -------- Login -------- */
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.redirect('/users/login');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.redirect('/users/login');

  req.session.user = { _id: user._id, name: user.name, email: user.email };
  res.redirect('/users/dashboard');
});

/* -------- Logout -------- */
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

/* -------- Dashboard + Game -------- */
router.get("/dashboard", isLoggedIn, async (req, res) => {
  let game = await Game.findOne({ userId: req.session.user._id });
  if (!game) game = await Game.create({ userId: req.session.user._id });
  res.render("dashboard", { user: req.session.user, game });
});

router.post("/dashboard/click", isLoggedIn, async (req, res) => {
  const { color } = req.body;
  const game = await Game.findOne({ userId: req.session.user._id });

  if (color === "red") game.red += 1;
  if (color === "blue") game.blue += 1;
  if (color === "green") game.green += 1;

  await game.save();
  res.redirect("/users/dashboard");
});

router.post("/dashboard/reset", isLoggedIn, async (req, res) => {
  const game = await Game.findOne({ userId: req.session.user._id });
  game.red = 0;
  game.blue = 0;
  game.green = 0;
  await game.save();
  res.redirect("/users/dashboard");
});

module.exports = router;
