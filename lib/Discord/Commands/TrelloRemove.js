const snekfetch = require("snekfetch");
const Command = require("../Command");
const ChannelConfig = require("../../Models/ChannelConfig");
const { trelloKey: key, trelloToken: token } = require("../../config");

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
    msg.channel.send("⚙ Working...");
    let conf = ChannelConfig.FindByChannel(msg.channel.id);
    if (!conf) return msg.channel.send(`❌ This channel doesn't has events for a Trello board`);
    return this._deleteWebhookFromBoard(conf.board, conf.webhookId).then(() => ChannelConfig.DeleteChannel(msg.channel.id))
    .then(() => {
      msg.channel.send(`✅ Successfully removed Trello board events from this channel.`);
    })
    .catch(err => {
      msg.channel.send(`❌ An error occurred! ${(err.response && err.response.text) || err.message || err.body || err}`);
    });
  }

  _searchForBoard(board) {
    return snekfetch
    .get(`https://api.trello.com/1/boards/${board}`)
    .query("key", key)
    .query("token", token)
    .query("fields", "name, desc")
    .then(res => res.body);
  }

  _deleteWebhookFromBoard(board, webhookId) {
    return snekfetch
    .delete(`https://api.trello.com/1/webhooks/${webhookId}`)
    .set("Content-Type", "application/json")
    .send({
      key, token,
    })
    .then(res => res.body);
  }
}


module.exports = TrelloInitCommand;
