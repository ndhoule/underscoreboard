'use strict';

var winston = require('winston');

module.exports = function(config) {
  var logger = module.exports = new (winston.Logger)({
    transports: [
      new winston.transports.Console(config.console)
    ],

    exitOnError: config.exitOnError
  });

  logger.setLevels(winston.config.syslog.levels);
  winston.addColors(winston.config.syslog.colors);

  return logger;
};
