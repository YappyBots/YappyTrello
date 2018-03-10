const mongoose = require("mongoose");
const { mongoDB } = require("../config");

mongoose.connect(mongoDB || 'localhost', {
  useMongoClient: true,
  autoReconnect: true,
  keepAlive: 1,
  connectTimeoutMS: 30000,
})
.catch((err) => {
  Log.error(err);
  process.exit(err.code || -1);
});

module.exports = {
  ChannelConfig: require("./ChannelConfig"),
};
