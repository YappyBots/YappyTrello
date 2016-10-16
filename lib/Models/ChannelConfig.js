const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let channelConfigSchema = Schema({
  channelId: String,
  guildId: String,
  webhookId: String,
  board: String,
  disabledEvents: Array,
});

let channelConfig = mongoose.model("ChannelConfig", channelConfigSchema);

class ChannelConfig {

  constructor(opts) {
    this._data = opts;
    this._model = new channelConfig(opts);
  }

  static FindByBoard(board) {
    return channelConfig.findOne({
      board: board,
    });
  }
  static FindByChannel(channel) {
    return channelConfig.findOne({
      channelId: channel,
    });
  }

  static DeleteChannel(channel) {
    return channelConfig.findOneAndRemove({
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
