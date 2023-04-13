const mongoose = require("mongoose");

const user_follows = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: "users",
  },
  followers: { type: Array, default: [] },
  following: { type: Array, default: [] },
});

module.exports = mongoose.model("user_follows", user_follows);
