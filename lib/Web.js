const express = require("express");
const bodyParser = require("body-parser");
const Log = require("./lib/Logger");

const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
const ip = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || null;

const Events = require("./TrelloEvents/Handler");
const app = express();

app.use(bodyParser.json());

app.post("/trello", (req, res) => {
  if (!res.body || !req.body.action) return res.send("Invalid data. Plz use Trello Webhooks.");
  return Events.use(req, res);
});

if (process.env.WEB_STANDALONE) {
  module.exports = app;
  return;
}

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send(err.stack);
  Log.error(err);
});

Log.Logger.info(`=> Starting app on ${ip || "localhost"}:${port}...`);

app.listen(ip, port, (err) => {
  if (err) Log.error(err);
  Log.info(`Web: Listening on ${ip || "localhost"}:${port}`);
});
