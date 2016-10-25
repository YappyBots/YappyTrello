const express = require("express");
const bodyParser = require("body-parser");
const Log = require("./Util/Log");
const bot = require("./Discord");

const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
const ip = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || null;

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

if (process.env.WEB_NO_STANDALONE) {
  Log.info(`=> Adding "Yappy Trello" to main web...`);
  let web = require("../../../web");
  web.post("/", WebhookResponse);
  Log.info(`=> Added "Yappy Trello" to main web!`);
  return;
}

app.all("/trello", WebhookResponse);

app.use((req, res, err) => {
  if (err.status === 404) return res.send("NOT FOUND");
  res.status(err.status || 500);
  res.send(err.stack);
  Log.error(err);
});

Log.info(`=> Web: Starting app on ${ip || "localhost"}:${port}...`);

app.listen(port, ip, (err, data) => {
  if (err || data) Log.error(err || data);
  Log.info(`=> Web: Listening on ${ip || "localhost"}:${port}`);
});
