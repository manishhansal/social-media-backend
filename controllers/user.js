const { default: mongoose } = require("mongoose");
const { generateToken } = require("../common_lib/jwt_token");
const postModel = require("../models/posts");

const home = (req, res, next) => {
  try {
    res.status(200).send("Welcome to home route");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const authenticate = (req, res) => {
  try {
    const { email, password } = req.body;
    const isUser = email === "manish@gmail.com" && password === "manish@123";
    if (isUser) {
      let user = {
        email,
      };
      let token = generateToken(user.email);

      res.send({ token, user });
    } else {
      return res.status(404).json({ msg: "no user found" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ msg: "something went wrong", err: e.message });
  }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find({});
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getSinglePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postModel.findOne({ _id: id});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createPost = async (req, res, next) => {
    try {
      let post = req.body;
      const response = await postModel.insertMany([post]);
      res.json({ status: 200, response });
    } catch (error) {
      res.json({ status: 401, error });
    }
  }


module.exports = { home, authenticate, getAllPosts, getSinglePost, createPost };
