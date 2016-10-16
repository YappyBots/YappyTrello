const EventsList = ["Unknown"];

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
    event.Webhook(webhook, data);
  }
}

module.exports = new Events();
