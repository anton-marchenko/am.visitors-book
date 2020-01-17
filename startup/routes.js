const express = require('express');
const routes = require('../routes');
const { error } = require('../middleware');

module.exports = (app) => {
    app.use(express.json());
    app.use('/api', routes);
    app.use(error);
}
