const mongoose = require("mongoose");

const posts = new mongoose.Schema({
  postId: { type: String, default: new mongoose.Types.ObjectId() },
  userId: { type: String, ref: "users" },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  created_at: { type: Number, default: Date.now() },
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model("posts", posts);
