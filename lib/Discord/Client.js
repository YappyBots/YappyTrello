const Discord = require("discord.js");
const DiscordClient = Discord.Client;
const WebcordUser = require("Webcord").User;
const fs = require("fs");

class Client extends DiscordClient {

  constructor(...args) {
    super(...args);

    this.commands = new Discord.Collection();
    this.aliases = new Discord.Collection();

    this.config = {
      owners: [
        "175008284263186437",
        "105408136285818880",
      ],
    };
  }

  login(...args) {
    this._webcordUser = new WebcordUser(args[0], true);
    return super.login(...args);
  }

  loadCommands(cwd) {
    fs.readdir(cwd, (err, files) => {
      if (err) {
        this.emit("error", err);
        return this;
      }

      files.forEach(f => {
        let Command = require(`./Commands/${f}`);

        try {
          Command = new Command(this);
          Command.props.help.file = f;

          this.commands.set(Command.help.name, Command);

          Command.conf.aliases.forEach(alias => {
            this.aliases.set(alias, Command.help.name);
          });
        } catch (error) {
          this.emit("error", error);
        }
      });
      return this;
    });
  }

  reloadCommand(command) {
    return new Promise((resolve, reject) => {
      try {
        delete require.cache[require.resolve(`./Commands/${command}`)];
        let cmd = require(`./Commands/${command}`);
        let Command = new cmd(this);
        Command.props.help.file = command;
        this.commands.set(Command.help.name, Command);
        Command.conf.aliases.forEach(alias => {
          this.aliases.set(alias, Command.help.name);
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  reloadFile(file) {
    return new Promise((resolve, reject) => {
      try {
        delete require.cache[require.resolve(file)];
        let thing = require(file);
        resolve(thing);
      } catch (e) {
        reject(e);
      }
    });
  }

  runCommand(msg) {
    if (!msg.content.startsWith("T! ")) return false;

    let content = msg.content.replace("T! ", "");
    let command = content.split(" ")[0];
    let args = content.split(" ").slice(1);
    let perms = this.permissions(msg);

    let cmd;

    if (this.commands.has(command)) {
      cmd = this.commands.get(command);
    } else if (this.aliases.has(command)) {
      cmd = this.commands.get(this.aliases.get(command));
    }

    if (cmd) {
      if (perms < cmd.conf.permLevel) return false;

      try {
        let commandRun = cmd.run(msg, args);
        if (commandRun && commandRun.catch) {
          commandRun.catch(e => this.emit("error", e));
        }
      } catch (e) {
        this.emit("error", e);
      }
    }

    return this;
  }

  permissions(msg) {
    /* This function should resolve to an ELEVATION level which
    is then sent to the command handler for verification*/
    let permlvl = 0;

    if (msg.member && msg.member.hasPermission(`ADMINISTRATOR`)) permlvl = 1;
    if (this.config.owners.includes(msg.author.id)) permlvl = 2;

    return permlvl;
  }

  fetchWebhooks(channel) {
    return new Promise((resolve, reject) => {
      if (!channel.guild.members.get(this.user.id).hasPermission(`MANAGE_WEBHOOKS`)) return resolve();
      this._webcordUser.fetchWebhooks(channel).then(webhooks => {
        let webhook = webhooks.filter(e => {
          let name = e.name.toLowerCase();
          return name.includes("yappy") || name.includes("trello");
        }).first();
        resolve(webhook);
      }).catch(reject);
    });
  }
  generateArgs(strOrArgs = "") {
    let str = Array.isArray(strOrArgs) ? strOrArgs.join(" ") : strOrArgs;
    let y = str.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g);
    if (y === null) return str.split(" ");
    return y.map(e => e.replace(/"/g, ``));
  }
}

module.exports = Client;
