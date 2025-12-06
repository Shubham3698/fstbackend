var express = require("express");
var router = express.Router();

const Message = require("../models/Message");

// Ye route database me se first message laayega
router.get("/get-message", async (req, res) => {
  try {
    const msg = await Message.findOne(); // pehla message
    res.json({ success: true, message: msg.text });
  } catch (err) {
    res.json({ success: false, message: "Error fetching message" });
  }
});

module.exports = router;
