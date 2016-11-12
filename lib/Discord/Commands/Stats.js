const Command = require("../Command");
const Log = require("../../Util/Log");
const moment = require("moment");
const pack = require("../../../package.json");
const DiscordJS = require("discord.js");

require("moment-duration-format");

const unit = ["", "K", "M", "G", "T", "P"];
const GetUptime = bot => moment.duration(bot.uptime).format("d[ days], h[ hours], m[ minutes, and ]s[ seconds]");
const bytesToSize = (input, precision) => {
  let index = Math.floor(Math.log(input) / Math.log(1024));
  if (unit >= unit.length) return `${input} B`;
  let msg = `${(input / Math.pow(1024, index)).toFixed(precision)} ${unit[index]}B`;
  return msg;
};

class StatsCommand extends Command {
  constructor(bot) {
    super(bot);
    this.props.help = {
      name: "stats",
      description: "Shows some stats of the bot... what else?",
      usage: "stats",
    };
    this.setConf({
      aliases: ["info"],
    });
  }
  run(msg) {
    let bot = this.bot;
    let MemoryUsage = bytesToSize(process.memoryUsage().rss, 3);
    let Booted = bot.booted;
    let Channels = bot.channels;
    let Guilds = bot.guilds;
    let Users = bot.users;
    let TextChannels = Channels.filter(e => e.type !== "voice").size;
    let VoiceChannels = Channels.filter(e => e.type === "voice").size;
    let Dependencies = {
      moment: pack.dependencies.moment.split("^")[1],
      mongoose: pack.dependencies.mongoose.split("^")[1],
      express: pack.dependencies.express.split("^")[1],
    };

    let dependencies = [
      `Moment v${Dependencies.moment}, Mongoose v${Dependencies.mongoose}, Express v${Dependencies.express}`,
    ].join(`\n${" ".repeat(17)}`);

    let message = [
      `# STATISTICS`,
      `Uptime         : ${GetUptime(bot)}`,
      `Booted         : ${Booted.date} @ ${Booted.time}`,
      `Memory Usage   : ${MemoryUsage}`,
      ``,
      `# SERVING`,
      `Guilds         : ${Guilds.size}`,
      `Channels       : ${Channels.size} (${TextChannels} text, ${VoiceChannels} voice)`,
      `Users          : ${Users.size}`,
      ``,
      `# BOT INFORMATION`,
      `Author(s)      : ${pack.author.replace(/<\S+[@]\S+[.]\S+>/g, "")}`,
      `Contributor(s) : ${pack.contributors ? pack.contributors.join(", ").replace(/<\S+[@]\S+[.]\S+>/g, "") : "None"}`,
      `Discord.JS	 : v${DiscordJS.version}`,
      `Dependencies   : ${dependencies}`,
    ];

    msg.channel.sendCode("LDIF", message).catch(Log.error);
  }
}

module.exports = StatsCommand;
