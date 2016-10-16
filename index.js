const Log = require('./lib/Util/Log');

require('./lib/Web');
require('./lib/Discord');

process.on('unhandledRejection', Log.error);
process.on('uncaughtException', Log.error);
