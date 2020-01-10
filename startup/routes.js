const express = require('express');
const routes = require('../routes');

module.exports = (app) => {
    app.use(express.json());
    app.use('/api', routes);
    // TODO: - use(error)
}
