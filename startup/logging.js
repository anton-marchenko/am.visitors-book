const winston = require('winston');
require('express-async-errors');

module.exports = () => {
    winston.handleExceptions(
        new (winston.transports.Console)({
            colorize:true,
            prettyPrint: true
        }),
        new (winston.transports.File)({
            filename: `${__dirname}/exceptions.log`
        })
        );
        
        process.on('unhandledRejection', (ex) => {
            throw ex;
        });


    winston.add(winston.transports.File, {
        filename: `${__dirname}/log.log`
    })


}