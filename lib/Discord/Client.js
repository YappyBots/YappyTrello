const Discord = require('discord.js');
const DiscordClient = Discord.Client;
const fs = require('fs');
const Log = require('../Util/Log');

class Client extends DiscordClient {

  constructor(...args) {
    super(...args);

    this.commands = new Discord.Collection();
    this.aliases = new Discord.Collection();

    this.config = {
      owners: [
        '175008284263186437',
        '105408136285818880'
      ]
    }
  }

  loadCommands(cwd) {
    fs.readdir(cwd, (err, files) => {
      if (err) {
        this.emit('error', err);
        return this;
      }

      files.forEach(f => {
        let command = require(`./Commands/${f}`);

        try {
          command = new command(this);
          Log.debug(`Loading Command: ${command.help.name}. 👌`);
          this.commands.set(command.help.name, command);

          command.conf.aliases.forEach(alias => {
            this.aliases.set(alias, command.help.name);
          });
        } catch (err) {
          this.emit('error', err);
        }
      });
    });
  }

  runCommand(msg) {
    if (!msg.content.startsWith('T! ')) return false;

    let content = msg.content.replace('T! ', '');
    let command = content.split(' ')[0];
    let args = content.split(' ').slice(1);
    let perms = this.permissions(msg);

    let cmd;

    if (this.commands.has(command)) {
      cmd = this.commands.get(command);
    } else if (this.aliases.has(command)) {
      cmd = this.commands.get(this.aliases.get(command));
    }

    if (cmd) {
      if (perms < cmd.conf.permLevel) return;

      try {
        let commandRun = cmd.run(msg, args);
        if (commandRun && commandRun.catch) {
          commandRun.catch(e => this.emit('error', e));
        }
      } catch (e) {
        this.emit('error', e);
      }
    }
  }

  permissions(msg) {
    /* This function should resolve to an ELEVATION level which
    is then sent to the command handler for verification*/
    let permlvl = 0;

    if (msg.member && msg.member.hasPermission(`ADMINISTRATOR`)) permlvl = 1;
    if (this.config.owners.includes(msg.author.id)) permlvl = 2;

    return permlvl;
  }

}

module.exports = Client;
