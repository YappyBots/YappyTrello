const WebcordUser = require("Webcord").User;
const { discordToken } = require("../config");

class WebhookUser extends WebcordUser {
  fetchWebhook(channelId) {
    return this.fetchWebhooks(channelId).then(webhooks => {
      let webhook = webhooks.filter(e => {
        let name = e.name;
        return name.includes("Yappy") || name.includes("Github");
      }).first();
      return Promise.resolve(webhook);
    });
  }
}

module.exports = new WebhookUser(discordToken, true);
