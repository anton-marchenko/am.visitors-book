const config = require('config');
const path = require('path');
const winston = require('winston');
require('express-async-errors');

module.exports = (appProcess) => {
    const logPath = config.get('logPath');

    winston.handleExceptions(
        new (winston.transports.Console)({
            colorize: true,
            prettyPrint: true
        }),
        new (winston.transports.File)({
            filename: path.join(logPath, 'error.log')
        })
    );

    // TODO - it is not responsibility of logger. Needs to move to separate module
    appProcess.on('unhandledRejection', (ex) => {
        throw ex;
    });

    winston.add(winston.transports.File, {
        filename: path.join(logPath, 'info.log')
    });
}