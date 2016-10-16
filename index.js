const Log = require("./lib/Util/Log");

let Web = require("./lib/Web");
require("./lib/Discord");
require("./lib/Models");

process.on("unhandledRejection", Log.error);
process.on("uncaughtException", Log.error);

if (process.env.WEB_STANDALONE) module.exports = Web;
