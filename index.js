require('dotenv').config();
const winston = require('winston');
const express = require('express');
const config = require('config');
const app = express();
const startup = require('./startup');

startup.config(config);
startup.logging(process);
startup.routes(app);
startup.db();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
