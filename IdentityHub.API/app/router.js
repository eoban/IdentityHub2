const express = require('express');
const authController=require('./controllers/auth.controller'),
    auth=require('./common/authMiddleware');

module.exports = function (app) {
    // Initializing route groups
    const apiRoutes = express.Router(),
        authRoutes = express.Router();

    //public auth routes to retrieve a jwt
    apiRoutes.use('/auth',authRoutes);         
    authRoutes.post('/token',authController.token);
    authRoutes.post('/register',authController.register);
    authRoutes.post('/authorize',auth.validateClaims,authController.getAuthenticatedUser);
    authRoutes.post('/testRole',auth.validateRolesAny(['user','bobo']),authController.getAuthenticatedUser);
    authRoutes.post('/testRole2',auth.validateRolesAll(['user','bobo']),authController.getAuthenticatedUser);
    app.use('/api', apiRoutes);
};
