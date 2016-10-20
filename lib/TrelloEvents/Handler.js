const Collection = require("discord.js").Collection;
const fs = require("fs");
const Log = require("../Util/Log");

class Events {
  constructor() {
    this.events = {};
    this.eventsList = new Collection();
    this.setup();
  }

  setup() {
    fs.readdir(__dirname, (err, files) => {
      if (err) throw err;

      files.forEach(file => {
        let eventName = file.replace(`.js`, ``);
        if (eventName === "Handler") return false;
        let event = require(`./${eventName}`);
        Log.debug(`Loading Trello Event: ${eventName} 👌`);
        this.eventsList.set(eventName, event);
      });
    });
  }

  use(channel, webhook, data, model) {
    let event = data.type;
    event = this.eventsList.get(event) || this.eventsList.get("Unknown");
    if (!webhook) return event.Channel(channel, data);
    let body = this.parseWebhook(event.Webhook(data), data, model);
    webhook.sendSlack(body);
  }

  parseWebhook(body, data, model) {
    body.attachments = body.attachments.map(e => {
      let avatarHash = data.memberCreator.avatarHash;
      e.author_name = data.data.board.name;
      e.author_link = `https://trello.com/b/${data.data.board.shortLink}`;
      e.title_link = e.title_link || model.url;
      e.footer = data.memberCreator.username;
      e.footer_icon = avatarHash ? `https://trello-avatars.s3.amazonaws.com/${avatarHash}/50.png` : null;
      e.ts = new Date() / 1000;
      return e;
    });
    return body;
  }
}

module.exports = new Events();
