const superagent = require("superagent");
const Command = require("../Command");
const ChannelConfig = require("../../Models/ChannelConfig");

class TrelloInitCommand extends Command {
  constructor(bot) {
    super(bot);

    this.props.help = {
      name: "remove",
      summary: "Remove trello board events on the channel.",
      usage: "remove",
    };

    this.setConf({
      permLevel: 1,
      aliases: ["initialize"],
    });
  }

  run(msg) {
    msg.channel.sendMessage("⚙ Working...");
    let conf = ChannelConfig.FindByChannel(msg.channel.id);
    if (!conf) return msg.channel.sendMessage(`❌ This channel doesn't has events for a Trello board`);
    return this._deleteWebhookFromBoard(conf.board, conf.webhookId).then(() => ChannelConfig.DeleteChannel(msg.channel.id))
    .then(() => {
      msg.channel.sendMessage(`✅ Successfully removed Trello board events from this channel.`);
    })
    .catch(err => {
      msg.channel.sendMessage(`❌ An error occurred! ${(err.response && err.response.text) || err.message || err.body || err}`);
    });
  }

  _searchForBoard(board) {
    return new Promise((resolve, reject) => {
      superagent
      .get(`https://api.trello.com/1/boards/${board}`)
      .query({
        fields: "name, desc",
        key: process.env.YAPPY_TRELLO_KEY,
        token: process.env.YAPPY_TRELLO_TOKEN,
      })
      .end((err, res) => {
        if (err) return reject(err);
        resolve(res.body);
      });
    });
  }

  _deleteWebhookFromBoard(board, webhookId) {
    return new Promise((resolve, reject) => {
      superagent
      .delete(`https://api.trello.com/1/webhooks/${webhookId}`)
      .set("Content-Type", "application/json")
      .send({
        key: process.env.YAPPY_TRELLO_KEY,
        token: process.env.YAPPY_TRELLO_TOKEN,
      })
      .end((err, res) => {
        if (err) return reject(err);
        resolve(res.body);
      });
    });
  }
}


module.exports = TrelloInitCommand;
