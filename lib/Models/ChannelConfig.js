const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let channelConfigSchema = Schema({
  channelId: String,
  guildId: String,
  webhook: String,
  board: String,
});

let channelConfig = mongoose.model("ChannelConfig", channelConfigSchema);

class ChannelConfig {

  constructor(opts) {
    this._data = opts;
    this._model = new channelConfig(opts);
  }

  static FindByBoard(board) {
    return channelConfig.findOne({
      boardId: board,
    });
  }
  static FindByChannel(channel) {
    return channelConfig.findOne({
      channelId: channel,
    });
  }

  Save() {
    return new Promise((resolve, reject) => {
      this._model.save((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

}

module.exports = ChannelConfig;
