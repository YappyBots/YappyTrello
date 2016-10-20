const Command = require("../Command");
const Log = require("../../Util/Log");
const fs = require("fs");
const path = require("path");

class ReloadCommand extends Command {
  constructor(bot) {
    super(bot);

    this.setHelp({
      name: "reload",
      description: "reloads a command, duh",
      usage: "reload <command>",
      examples: [
        "reload stats",
        "reload test",
      ],
    });

    this.setConf({
      permLevel: 2,
    });
  }

  run(msg, args) {
    let cmdName = args[0] ? args[0].toLowerCase() : null;
    let bot = this.bot;
    let command = bot.commands.get(cmdName);

    if (!command && bot.aliases.has(cmdName)) {
      command = bot.aliases.get(cmdName);
    } else if (!cmdName) {
      return msg.channel.sendMessage(`No command name was provided to reload`);
    } else if (!command) {
      return msg.channel.sendMessage(`I cannot find the command \`${cmdName}\``);
    }

    let fileName = command ? command.help.file : null;
    let filePath = path.resolve(__dirname, fileName);
    fs.stat(filePath, (err, stats) => {
      if (err) return msg.channel.sendMessage(`I cannot find the file ${fileName}\n\`${err}\``);
      if (!stats.isFile()) return msg.channel.sendMessage(`Command \`${cmdName}\` is not a file :/`);
      msg.channel.sendMessage(`Reloading Command \`${cmdName}\`...`).then(m => {
        bot.reloadCommand(fileName).then(() => {
          m.edit(`Successfully Reloaded Command \`${cmdName}\``);
        }).catch(e => {
          m.edit([
            `Unable To Reload Command \`${cmdName}\``,
            "```js",
            e.stack,
            "```",
          ]);
        });
      }).catch(e => {
        Log.error(e);
        msg.channel.sendMessage(`Unable To Reload Command \`${cmdName}\``);
      });
    });
  }
}


module.exports = ReloadCommand;
