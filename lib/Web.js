const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
const ip = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || null;

const Events = require("./TrelloEvents/Handler");

app.use(bodyParser.json());

app.all("/trello", (req, res) => {
  if (!req.body || !req.body.action) return res.send("OK");
  return Events.use(req, req);
});

app.listen(port, ip, () => {
  "";
});
