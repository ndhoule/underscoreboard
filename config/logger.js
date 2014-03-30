'use strict';

var winston = require('winston');

var logger = module.exports = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
      level: 'info',
      timestamp: false,
      colorize: true
    })
  ],

  exitOnError: false
});

logger.setLevels(winston.config.syslog.levels);
winston.addColors(winston.config.syslog.colors);
