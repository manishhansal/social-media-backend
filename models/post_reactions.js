const mongoose = require("mongoose");

const post_reactions = new mongoose.Schema({
  reactionId: { type: String, default: new mongoose.Types.ObjectId() },
  postId: { type: String, ref: "posts" },
  likes: { type: Array, default: [] },
  unlikes: { type: Array, default: [] },
  created_at: { type: Number, default: Date.now() },
});

module.exports = mongoose.model("post_reactions", post_reactions);
