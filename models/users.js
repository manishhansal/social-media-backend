const mongoose = require("mongoose");

const users = new mongoose.Schema({
  userId: {
    type: String,
    default: new mongoose.Types.ObjectId(),
  },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number_of_followers: { type: Number, default: 0 },
  number_of_followings: { type: Number, default: 0 },
  created_at: { type: Number, default: Date.now() },
});

module.exports = mongoose.model("users", users);
