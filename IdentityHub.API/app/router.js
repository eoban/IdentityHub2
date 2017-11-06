const express = require('express');

module.exports = function (app) {
    // Initializing route groups
    const apiRoutes = express.Router();
    apiRoutes.get('/test', function (req, res) {
        res.status(200).json({ works: 'good' });
    });
    app.use('/api', apiRoutes);
};