const mongoose = require('mongoose');
const config = require('config');

module.exports = () => {
    const db = config.get('db');

    mongoose.connect(db, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log(`Connected to ${db}`));
}