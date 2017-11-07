const express = require('express');
const authController=require('./controllers/auth.controller');

module.exports = function (app) {
    // Initializing route groups
    const apiRoutes = express.Router(),
        authRoutes = express.Router();

    //public auth routes to retrieve a jwt
    apiRoutes.use('/auth',authRoutes);        
    authRoutes.post('/token',authController.token);
    authRoutes.post('/register',authController.register);
    authRoutes.post('/authorizeClient',authController.authorizeClient)
    authRoutes.post('/authorizeApi',authController.authorizeApi)
    app.use('/api', apiRoutes);
};
