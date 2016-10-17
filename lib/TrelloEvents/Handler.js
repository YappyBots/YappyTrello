const EventsList = ["Unknown", "createCard"];

class Events {
  constructor() {
    this.events = {};
    this.setup();
  }

  setup() {
    for (let event of EventsList) this.events[event] = require(`./${event}`);
  }

  use(channel, webhook, data) {
    let event = data.type;
    event = this.events[event] || this.events.Unknown;
    if (!webhook) return event.Channel(channel, data);
    let body = this.parseWebhook(event.Webhook(data), data);
    webhook.sendSlack(body);
  }

  parseWebhook(body, data) {
    body.attachments = body.attachments.map(e => {
      let avatarHash = data.memberCreator.avatarHash;
      e.author_name = data.memberCreator.username;
      e.author_icon = avatarHash ? `https://trello-avatars.s3.amazonaws.com/${avatarHash}/50.png` : null;
      e.author_link = `https://trello.com/${data.memberCreator.username}`;

      e.footer = `${data.data.board.name}`;
      e.ts = new Date() / 1000;
      return e;
    });
    return body;
  }
}

module.exports = new Events();
