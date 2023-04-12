const mongoose = require("mongoose");

const users = new mongoose.Schema({
  userId: {
    type: String,
  },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  number_of_followers: { type: Number, default: 0 },
  number_of_followings: { type: Number, default: 0 },
  created_at: { type: Number, default: Date.now() },
});

module.exports = model("users", users);
