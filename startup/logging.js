const config = require('config');
const path = require('path');
const winston = require('winston');
require('express-async-errors');

module.exports = () => {
    const logPath = config.get('logPath');

    winston.handleExceptions(
        new (winston.transports.Console)({
            colorize: true,
            prettyPrint: true
        }),
        new (winston.transports.File)({
            filename: path.join(logPath, 'exceptions.log')
        })
    );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });


    winston.add(winston.transports.File, {
        filename: path.join(logPath, 'log.log')
    })


}