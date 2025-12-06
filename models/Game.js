const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  red: { type: Number, default: 0 },
  blue: { type: Number, default: 0 },
  green: { type: Number, default: 0 }
});

module.exports = mongoose.model("Game", gameSchema);
