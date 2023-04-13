const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const userController = require("../controllers/user");
const { authMiddleware } = require("../middleware/auth_middleware");

app.get("/", userController.home);
app.post("/api/authenticate", userController.authenticate);
app.get("/api/all_posts", authMiddleware, userController.getAllPosts);
app.get("/api/posts/:id", authMiddleware, userController.getSinglePost);
app.post("/api/posts", authMiddleware, userController.createPost);
app.post("/api/comment/:id", authMiddleware, userController.addComment);
app.get("/api/user", authMiddleware, userController.getUser);
app.delete("/api/posts/:id", authMiddleware, userController.deletePost);
app.post("/api/like/:id", authMiddleware, userController.likePost);
app.post("/api/unlike/:id", authMiddleware, userController.unlikePost);
app.post("/api/follow/:id", authMiddleware, userController.followUser);
app.post("/api/unfollow/:id", authMiddleware, userController.unfollowUser);

module.exports = app;
