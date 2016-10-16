const mongoose = require("mongoose");

mongoose.connect(process.env.YAPPY_TRELLO_MONGODB);

mongoose.Promise = global.Promise;

module.exports = {
  ChannelConfig: require("./ChannelConfig"),
};
