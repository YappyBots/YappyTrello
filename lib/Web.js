const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
const ip = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || null;

const Events = require("./Events/Handler");

app.use(bodyParser.json());

app.all("/trello", (req, res) => {
  let event = Events[req.body.action.type];
  if (event) event(webhook, req.body.action);
  console.log(JSON.stringify(req.body.action, null, 4));
  res.send("OKAY");
});

app.listen(port, ip, () => {
    console.log("Listening to Trello.");
});
