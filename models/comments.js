const mongoose = require("mongoose");

const comments = new mongoose.Schema({
  commentId: { type: String, default: new mongoose.Types.ObjectId() },
  postId: { type: String, ref: "posts" },
  userId: { type: String, ref: "users" },
  comment: { type: String, required: true },
  created_at: { type: Number, default: Date.now() },
});

module.exports = mongoose.model("comments", comments);
