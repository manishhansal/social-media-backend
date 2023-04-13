const { default: mongoose } = require("mongoose");
const { generateToken } = require("../common_lib/jwt_token");
const postModel = require("../models/posts");
const commentModel = require("../models/comments");
const userModel = require("../models/users");
const postReactionsModel = require("../models/post_reactions");
const userFollowsModel = require("../models/user_follows");

const home = (req, res, next) => {
  try {
    res.status(200).send("Welcome to home route");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
      if (user.password === password) {
        let token = generateToken(user.userId);
        res.status(200).json({ status: 200, token });
      } else {
        return res.status(401).json({ status: 401, msg: "wrong password" });
      }
    } else {
      return res.status(404).json({ status: 404, msg: "no user found" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ status: 500, msg: "something went wrong", err: e.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "postId",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $sort: { created_at: -1 },
      },
      {
        $project: {
          _id: 0,
          userId: 0,
          __v: 0,
        },
      },
    ]);

    res.status(200).json({ status: 200, posts });
  } catch (error) {
    res.status(401).json({ status: 401, message: error.message });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.aggregate([
      {
        $match: { postId: id },
      },
      {
        $lookup: {
          from: "comments",
          localField: "postId",
          foreignField: "postId",
          as: "comments",
        },
      },

      {
        $project: {
          _id: 0,
          userId: 0,
          __v: 0,
        },
      },
    ]);
    res.status(200).json({ status: 200, post });
  } catch (error) {
    res.status(401).json({ status: 401, message: error.message });
  }
};

const createPost = async (req, res, next) => {
  try {
    let post = req.body;
    let { userId } = req.headers;
    userId = JSON.parse(userId);
    post.userId = userId;
    const response = await postModel.insertMany([post]);
    const result = {
      postId: response[0].postId,
      title: response[0].title,
      desc: response[0].desc,
      created_at: new Date(response[0].created_at).toUTCString(),
    };
    res.status(200).json({ status: 200, result });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};

const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    let { userId } = req.headers;
    userId = JSON.parse(userId);
    const commentObj = {
      postId: id,
      comment,
      userId,
    };
    const response = await commentModel.insertMany([commentObj]);
    const commentId = response[0].commentId;
    res.status(200).json({ status: 200, commentId });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};

const getUser = async (req, res, next) => {
  try {
    let { userId } = req.headers;
    userId = JSON.parse(userId);
    const response = await userModel.findOne({ userId: userId });
    const user = {
      username: response.username,
      number_of_followers: response.number_of_followers,
      number_of_followings: response.number_of_followings,
    };
    res.status(200).json({ status: 200, user });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await postModel.deleteOne({ postId: id });
    res.status(200).json({ status: 200, response });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};

const updateLikes = async (action, id) => {
  try {
    const resp = await postModel.findOne({ postId: id });
    const currentLikes = resp.likes;
    const updatedLikes =
      action === "like" ? currentLikes + 1 : currentLikes - 1;
    await postModel.findOneAndUpdate(
      {
        postId: id,
      },
      {
        likes: updatedLikes,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { userId } = req.headers;
    userId = JSON.parse(userId);

    if (id === "" || id === undefined) {
      return res
        .status(400)
        .json({ status: 400, msg: "Please provide an id to like" });
    }

    try {
      let postReactions = await postReactionsModel.findOne({ postId: id });

      // this if is for checking if postReactions data exists
      if (postReactions) {
        let isAlreadyLiked = postReactions.likes.filter(
          (item) => item.userId == userId
        );

        // this is for checking if already liked if already liked remove liked
        if (isAlreadyLiked.length > 0) {
          await postReactionsModel.updateOne(
            { postId: id },
            { $pull: { likes: { userId: userId } } }
          );

          updateLikes("", id);
          res.status(200).json({ status: 200, msg: "like removed" });
        } else {
          // else make a like and remove unlike if any
          await postReactionsModel.findOneAndUpdate(
            {
              postId: id,
            },
            {
              $push: { likes: { userId: userId } },
              $pull: { unlikes: { userId: userId } },
            }
          );

          updateLikes("like", id);
          res.status(200).json({ status: 200, msg: "liked" });
        }
      } else {
        // this is for creating new postReaction data
        await postReactionsModel.create({
          postId: id,
          likes: [{ userId: userId }],
        });

        updateLikes("like", id);
        res.status(200).json({ status: 200, msg: "liked" });
      }
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ status: 500, msg: "something went wrong", err: e.message });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: 401, error });
  }
};

const unlikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { userId } = req.headers;
    userId = JSON.parse(userId);

    if (id === "" || id === undefined) {
      return res
        .status(400)
        .json({ status: 400, msg: "Please provide an id to unlike" });
    }

    try {
      let postReactions = await postReactionsModel.findOne({ postId: id });

      // this if is for checking if postReactions data exists
      if (postReactions) {
        let isAlreadyUnliked = postReactions.unlikes.filter(
          (item) => item.userId == userId
        );

        // this is for checking if already unliked if already unliked remove unliked
        if (isAlreadyUnliked.length > 0) {
          await postReactionsModel.updateOne(
            { postId: id },
            { $pull: { unlikes: { userId: userId } } }
          );
          res.status(200).json({ status: 200, msg: "unlike removed" });
        } else {
          // else make a unlike and remove like if any
          await postReactionsModel.findOneAndUpdate(
            {
              postId: id,
            },
            {
              $push: { unlikes: { userId: userId } },
              $pull: { likes: { userId: userId } },
            }
          );

          res.status(200).json({ status: 200, msg: "unliked" });
        }
      } else {
        // this is for creating new postReaction data
        await postReactionsModel.create({
          postId: id,
          unlikes: [{ userId: userId }],
        });
        res.status(200).json({ status: 200, msg: "unliked" });
      }
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ status: 500, msg: "something went wrong", err: e.message });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: 401, error });
  }
};

const createFollower = async (userId, follower_id) => {
  if (follower_id === "" || follower_id === undefined) {
    return;
  }

  try {
    let user = await userModel.findOne({ id: userId });
    if (!user) {
      return;
    }

    let isFollowerExists = await userFollowsModel.findOne({ userId: userId });
    if (isFollowerExists) {
      let isAlreadyFollowed = await userFollowsModel.findOne({
        userId: userId,
        following: {
          $elemMatch: { userId: follower_id },
        },
      });

      if (isAlreadyFollowed) {
        return;
      }

      await userFollowsModel.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            followers: { userId: follower_id },
          },
        }
      );
    } else {
      await userFollowsModel.create({
        userId: userId,
        followers: [{ userId: follower_id }],
      });

      return;
    }
  } catch (e) {
    console.log(e.message);
  }
};

const removeFollower = async (userId, follower_id) => {
  if (follower_id === "" || follower_id === undefined) {
    return;
  }

  try {
    let user = await userModel.findOne({ id: userId });
    if (!user) {
      return;
    }

    let isFollowerExists = await userFollowsModel.findOne({ userId: userId });
    if (isFollowerExists) {
      await userFollowsModel.updateOne(
        { userId: userId },
        { $pull: { followers: { userId: follower_id } } },
        { safe: true, multi: true }
      );
    }
  } catch (e) {
    console.log("err in removeFollower", err.message);
    return;
  }
};

const updateFollowers = async (type, userId, follower_id) => {
  try {
    const following = await userModel.findOne({ userId: userId });
    const number_of_followings = following.number_of_followings;
    const follower = await userModel.findOne({ username: follower_id });
    const number_of_followers = follower.number_of_followers;

    const updatedNumberOfFollowings =
      type === "follow" ? number_of_followings + 1 : number_of_followings - 1;
    const updatedNumberOfFollowers =
      type === "follow" ? number_of_followers + 1 : number_of_followers - 1;

    await userModel.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        number_of_followings: updatedNumberOfFollowings,
      }
    );
    await userModel.findOneAndUpdate(
      {
        username: follower_id,
      },
      {
        number_of_followers: updatedNumberOfFollowers,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const followUser = async (req, res) => {
  let { id } = req.params;
  let { userId } = req.headers;
  userId = JSON.parse(userId);

  if (id === "" || id === undefined) {
    return res
      .status(400)
      .json({ status: 400, msg: "please provide an id to follow" });
  }

  try {
    let user = await userModel.findOne({ userId: userId });
    let userToFollow = await userModel.findOne({ username: id });

    following_id = userToFollow.username;

    if (!user || !userToFollow) {
      return res.status(401).json({ status: 401, msg: "user not found" });
    }
    if (userId === following_id) {
      return res.status(400).json({ status: 400, msg: "cannot follow self" });
    }

    let isFollowerExists = await userFollowsModel.findOne({ userId: userId });
    if (isFollowerExists) {
      let isAlreadyFollowed = await userFollowsModel.findOne({
        userId: userId,
        following: {
          $elemMatch: { userId: following_id },
        },
      });
      if (isAlreadyFollowed) {
        return res.status(401).send({ status: 401, msg: "already followed" });
      }

      await userFollowsModel.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            following: { userId: following_id },
          },
        }
      );
      createFollower(following_id, userId);
      updateFollowers("follow", userId, id);
      res.send({ status: 201, msg: "followed" });
    } else {
      let followers = await userFollowsModel.create({
        userId: userId,
        following: [{ userId: following_id }],
      });
      createFollower(following_id, userId);
      updateFollowers("follow", userId, id);
      res.send({ status: 201, msg: "followed", followers });
    }
  } catch (e) {
    res
      .status(500)
      .json({ status: 500, msg: "Something went wrong", err: e.message });
  }
};

const unfollowUser = async (req, res) => {
  let { id } = req.params;
  let { userId } = req.headers;
  userId = JSON.parse(userId);

  if (id === "" || id === undefined) {
    return res
      .status(400)
      .json({ status: 400, msg: "please provide an id to unfollow" });
  }

  try {
    let user = await userModel.findOne({ userId: userId });
    let userToFollow = await userModel.findOne({ username: id });
    following_id = userToFollow.username;

    if (!user || !userToFollow) {
      return res.status(401).json({ status: 401, msg: "user not found" });
    }

    let isFollowerExists = await userFollowsModel.findOne({ userId: userId }); // just an error checking
    if (isFollowerExists) {
      await userFollowsModel.updateOne(
        { userId: userId },
        { $pull: { following: { userId: following_id } } },
        { safe: true }
      );

      removeFollower(following_id, userId);
      updateFollowers("", userId, id);
      return res
        .status(200)
        .json({ status: 200, msg: "unfollowed successfully" });
    } else {
      return res.status(401).json({ status: 401, msg: "nothing to do" });
    }
  } catch (e) {
    res.status(500).send({ status: 500, msg: "something went wrong" });
  }
};

module.exports = {
  home,
  authenticate,
  getAllPosts,
  getSinglePost,
  createPost,
  addComment,
  getUser,
  deletePost,
  likePost,
  unlikePost,
  followUser,
  unfollowUser,
};
