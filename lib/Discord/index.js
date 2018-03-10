const path = require("path");
const Client = require("./Client");
const Log = require("../Util/Log");
const { discordToken } = require("../config");
const bot = new Client();

bot.on("ready", () => {
  Log.info("=> Bot: Logged In");
  bot.booted = {
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  };
});
bot.on("error", Log.error);

bot.on("message", (msg) => {
  bot.runCommand(msg);
});

bot.loadCommands(path.resolve(__dirname, "Commands"));

// === LOGIN ===

Log.info("=> Bot: Logging in...");
bot.login(discordToken).catch((err) => {
  Log.error("=> Bot: Unable to log in");
  Log.error(err);
});

module.exports = bot;
