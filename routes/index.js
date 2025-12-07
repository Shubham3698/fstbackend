var express = require('express');
var router = express.Router();
const Game = require("../models/Game");

// Middleware to check login
function isAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/users/login");
}

// Root redirect
router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// Dashboard route
router.get("/dashboard", isAuth, async (req, res) => {
  try {
    // Fetch game document for logged-in user
    let game = await Game.findOne({ userId: req.session.user._id });

    // Agar game document nahi hai to create karo
    if (!game) {
      game = new Game({ userId: req.session.user._id });
      await game.save();
    }

    // Pass both user and game to EJS
    res.render("dashboard", { user: req.session.user, game: game });
  } catch (err) {
    console.log("Dashboard Error:", err);
    res.send("Something went wrong");
  }
});

// Handle button clicks
router.post("/dashboard/click", isAuth, async (req, res) => {
  const { color } = req.body; // red, blue, green
  try {
    const game = await Game.findOne({ userId: req.session.user._id });
    if (game && game[color] !== undefined) {
      game[color] += 1;
      await game.save();
    }
    res.redirect("/dashboard");
  } catch (err) {
    console.log("Click Error:", err);
    res.send("Error updating click");
  }
});

module.exports = router;
