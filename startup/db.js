const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = () => {
    const db = config.get('db');

    mongoose.connect(db, {
        useFindAndModify: false, // TODO - needs reserach
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => winston.info(`Connected to ${db}`));
}