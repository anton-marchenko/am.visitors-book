require('dotenv').config();
const winston = require('winston');
const express = require('express');
const app = express();
const startup = require('./startup');

startup.config();
startup.logging();
startup.routes(app);
startup.db();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
