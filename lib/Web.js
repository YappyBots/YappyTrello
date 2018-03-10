const express = require("express");
const bodyParser = require("body-parser");
const Log = require("./Util/Log");
const bot = require("./Discord");

const { webPort: port, webIP: ip} = require("../config");

const Events = require("./TrelloEvents/Handler");
const ChannelConfig = require("./Models/ChannelConfig");
const WebhookUser = require("./Util/WebhookUser");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  Log.web(`${req.method} ${req.path}`);
  next();
});

let WebhookResponse = (req, res) => {
  if (!req.body || !req.body.action || !req.body.action.type) return res.send("Invalid data. Plz use Trello Webhooks.");
  let { action, model } = req.body;
  let data = {};
  let conf = ChannelConfig.FindByBoard(action.data.board.id);
  if (!conf) return res.send(`No channel has events for the Trello board ${action.data.board.name}`);
  let { channelId, disabledEvents } = conf;
  data.channel = bot.channels.get(channelId);
  if (disabledEvents.includes(action.type)) {
    return res.send(`This event is disabled. Get rekt.`);
  }
  return WebhookUser.fetchWebhook(channelId).then(webhook => {
    res.send(`Doing something with the event ${action.type}`);
    Events.use(data.channel, webhook, action, model);
  });
};

app.all("/YappyTrello", WebhookResponse);

app.use((err, req, res, next) => {
  if (!next) return false;
  if (err.status === 404) return res.send("NOT FOUND");
  res.status(err.status || 500);
  Log.error(err);
  res.send(err.stack);
});

Log.info(`=> Web: Starting app on ${ip || "localhost"}:${port}...`);

app.listen(port, ip, (err, data) => {
  if (err || data) Log.error(err || data);
  Log.info(`=> Web: Listening on ${ip || "localhost"}:${port}`);
});
