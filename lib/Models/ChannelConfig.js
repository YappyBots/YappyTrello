const mongoose = require("mongoose");
const Collection = require("discord.js").Collection;
const Schema = mongoose.Schema;

let channelConfigSchema = Schema({
  channelId: String,
  guildId: String,
  webhookId: String,
  board: String,
  disabledEvents: Array,
  webhook: String,
});

let channelConfig = mongoose.model("ChannelConfig", channelConfigSchema);

class ChannelConfigItem {
  constructor(client, config) {
    this._client = client;
    for (let key in config) {
      if (config.hasOwnProperty(key)) {
        this[key] = config[key];
      }
    }
  }
  set(prop, value) {
    return this._client.SetChannel(this.channelId, prop, value);
  }
  delete() {
    return this._client.DeleteChannel(this.channelId);
  }
}

class ChannelConfig {
  constructor() {
    this._data = new Collection();
    this.setup();
  }
  setup() {
    channelConfig.find({}).then(configs => {
      configs.forEach(row => {
        this._data.set(row.channelId, new ChannelConfigItem(this, row._doc));
      });
    });
  }
  FindByBoard(board) {
    return this._data.find("board", board);
  }
  FindByChannel(channel) {
    return this._data.get(channel);
  }
  DeleteChannel(channel) {
    return channelConfig.findOneAndRemove({
      channelId: channel,
    }).then(() => {
      this._data.delete(channel);
    });
  }
  SetChannel(channel, prop, value) {
    return new Promise((resolve, reject) => {
      let oldConfig = this._data.get(channel);
      let newConfig = oldConfig;
      newConfig[prop] = value;
      channelConfig.findOneAndUpdate({
        channelId: channel,
      }, newConfig, {
        new: true,
      }, (err) => {
        if (err) return reject(err);
        this._data.set(newConfig.channel, new ChannelConfigItem(this, newConfig));
        resolve(newConfig);
      });
    });
  }
  Add(conf) {
    channelConfig.create(conf).then(() => {
      this._data.set(conf.channelId, new ChannelConfigItem(this, conf));
    });
  }
}

module.exports = new ChannelConfig();
