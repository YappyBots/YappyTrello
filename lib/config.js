require("dotenv").config();

module.exports = {
  trelloKey: process.env.TRELLO_KEY,
  trelloToken: process.env.TRELLO_TOKEN,
  trelloCallbackUrl: process.env.TRELLO_CALLBACK_URL,

  webStandalone: process.env.WEB_STANDALONE,

  discordToken: process.env.DISCORD_TOKEN,

  mongoDB: process.env.MONGODB,

  webPort: process.env.WEB_PORT || process.env.PORT || 8080,
  webIP: process.env.WEB_IP || process.env.IP || null,
}
