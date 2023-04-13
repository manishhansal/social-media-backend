const mongoose = require("mongoose");
require("dotenv").config();

class Mongo {
  constructor() {
    this.createMongoConnection();
  }

  createMongoConnection() {
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mgnrv.mongodb.net/social_backend?retryWrites=true&w=majority`
    );

    mongoose.connection.once("open", () => {
      console.log("MongoDB is connected");
    });
    mongoose.connection.on("error", () => {
      console.log("Error occurred in mongoDB connection");
    });
  }
}

module.exports = Mongo;
