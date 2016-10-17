const EventsList = ["Unknown", "createCard"];

class Events {
  constructor() {
    this.events = {};
    this.setup();
  }

  setup() {
    for (let event of EventsList) this.events[event] = require(`./${event}`);
  }

  use(channel, webhook, data, model) {
    let event = data.type;
    event = this.events[event] || this.events.Unknown;
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
