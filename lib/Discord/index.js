const Discord = require('discord.js');
const Client = require('./Client');
const Log = require('../Util/Log');
const bot = new Client();
const TOKEN = process.env.DISCORD_TESTING_BOT_TOKEN || process.env.YAPPY_TRELLO_TOKEN;

bot.on('ready', () => {
  Log.info('=> Bot: Logged In');
});
bot.on('error', Log.error);

bot.on('message', (msg) => {
  bot.runCommand(msg);
});

bot.loadCommands(__dirname + '/Commands');

// === LOGIN ===

Log.info('=> Bot: Logging in...');

bot.login(TOKEN).catch((err) => {
  Log.error('=> Bot: Unable to log in');
  Log.error(err);
});
