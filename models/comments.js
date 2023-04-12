const mongoose = require("mongoose");

const comments = new mongoose.Schema({
  commentId: { type: String },
  postId: { type: String, ref: "posts" },
  comment: { type: String },
  created_at: { type: Number, default: Date.now() },
});

module.exports = mongoose.model("comments", comments);
