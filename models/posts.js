const mongoose = require("mongoose");

const posts = new mongoose.Schema({
  postId: { type: String },
  title: { type: String },
  desc: { type: String },
  created_at: { type: Number, default: Date.now() },
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model("posts", posts);
