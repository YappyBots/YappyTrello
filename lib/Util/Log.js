const path = require("path");
const EventEmitter = require("events").EventEmitter;
const moment = require("moment");
const util = require("util");
const icons = {
  error: "🔥  ",
  debug: "⚙  ",
  info: "🆗   ",
  message: "💁",
};
let logs = [];
let botPath = path.resolve(__dirname, "../");
let botPathRegEx = new RegExp(botPath, "g");

/**
 * A Logger to replace `console.log`.
 * It logs to the console, web, AND LogDNA
 */
class Logger extends EventEmitter {

  constructor() {
    super();

    this.debug = this.debug.bind(this);
    this.info = this.info.bind(this);
    this.error = this.error.bind(this);
    this.message = this.message.bind(this);
    this.github = this.github.bind(this);

    this._token = process.env.DISCORD_TESTING_BOT_TOKEN || process.env.BOT_TOKEN;
  }

  /**
   * Debug it like you would `console.log` it ;)
   * @param {Mixed} ...args - all the arguments
   */
  debug(...args) {
    this.log("debug", ...args);
  }

  /**
   * Give me some info, pls
   * @param {Mixed} ...args - all the arguments
   */
  info(...args) {
    this.log("info", ...args);
  }

  /**
   * You gotta error it to me ;((
   * @param {Mixed} error - an error
   */
  error(error) {
    if (typeof error === "object" && error.stack) {
      error.stack = error.stack.replace(botPathRegEx, ".");
      if (this._token) error.stack = error.stack.replace(new RegExp(this._token, "g"), "TOKEN_WAS_HERE");
    }
    this.log("error", error);
  }

  /**
   * Log a message!
   * @param {Mixed} msg - Log the message
   */
  message(msg) {
    this.log("message", msg);
  }

  /**
   *
   * @param {string} event - what kind of log
   * @param {cb} cb - callback
   * @returns {undefined}
   */
  on(event, cb) {
    this.emitter.on(event, cb);
  }

  // inside

  /**
   * Log, with the level and the message
   * @param {string} level - log level, i.e: error
   * @param {Mixed} message - actual message, ya know?
   * @private
   * @returns {undefined}
   */
  log(...args) {
    let data = [...args].slice(1);

    let log = `[${moment().format("MM/D/YY HH:mm:ss")}] ${icons[args[0]]} ${args[0]}: ${util.format(...data)}`;

    console.log(log);

    this.emit(log);
  }

  /**
   * Get all the logs from the latest run
   * @returns {Array} logs - Logs, hhm..
   */
  get logs() {
    return logs;
  }
}

module.exports = new Logger();