const superagent = require("superagent");
const Command = require("../Command");
const Log = require("../../Util/Log");
const ChannelConfig = require("../../Models/ChannelConfig");

class TrelloInitCommand extends Command {
  constructor(bot) {
    super(bot);

    this.props.help = {
      name: "init",
      summary: "Initialize trello board events on the channel.",
      description: "Initialize trello board events on the channel.",
      usage: "init <boardId> [webhookUrl/webhookId] [webhookToken]",
      examples: [
        "init ttDOjGp5",
        "init 5803ba32d0514d27823abf3b",
        "init https://trello.com/b/ttDOjGp5",
        "init https://trello.com/b/ttDOjGp5/yappy-trello",
      ],
    };

    this.setConf({
      permLevel: 1,
      aliases: ["initialize"],
    });
  }

  run(msg, args) {
    let board = args[0];
    let boardInfo = {};
    msg.channel.sendMessage("⚙ Working...");

    ChannelConfig.FindByChannel(msg.channel.id).then(conf => {
      if (conf) throw new Error(`This channel already has events for a Trello board`, "custom");

      return this._searchForBoard(board);
    })
    .then(data => {
      boardInfo = data;
      Log.debug(data);
      return ChannelConfig.FindByBoard(data.id);
    })
    .then(conf => {
      if (conf) throw new Error(`This board already has events in another channel`, "custom");

      return this._createWebhookForBoard(boardInfo.id, msg.guild);
    })
    .then(webhook => {
      let newConf = new ChannelConfig({
        channelId: msg.channel.id,
        guildId: msg.guild.id,
        board: boardInfo.id,
        disabledEvents: [],
        webhookId: webhook.id,
      });

      return newConf.Save();
    })
    .then(() => {
      msg.channel.sendMessage(`✅ Successfully initialized Trello board events for **${boardInfo.name}**.`);
    })
    .catch(err => {
      if (err.response && err.response.text && err.response.text === "invalid id") {
        err.response.text = "An invalid board ID was provided. Please make sure you enter a valid board ID and that the bot is a member of your board.";
      }
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

  _createWebhookForBoard(board, guild) {
    return new Promise((resolve, reject) => {
      superagent
      .post(`https://api.trello.com/1/webhooks`)
      .set("Content-Type", "application/json")
      .send({
        description: `A webhook for board events in a Discord Server (${guild ? guild.name : "Unknown"} guild)`,
        callbackURL: "https://d47b27c4.ngrok.io/trello",
        idModel: board,
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
