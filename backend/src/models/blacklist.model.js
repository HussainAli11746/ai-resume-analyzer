const mongoose = require("mongoose");
const dotenv = require("dotenv");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token is required"]
  },
});

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = blacklistModel;