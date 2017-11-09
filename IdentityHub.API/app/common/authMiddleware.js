const jwt = require('jsonwebtoken');
const config = require('../config/config'),
    User = require('../models/auth/user'),
    Client = require('../models/auth/client'),
    API = require('../models/auth/api');

exports.validateToken = function (req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['authorization'];
    if (token) {
        try {
            req.auth = jwt.verify(token.split(' ')[1], config.secret)
            if (!req.auth) {
                return res.end('Invalid access token provided', 400);
            }
            next();
        } catch (err) {
            return res.end(err, 400);
        }
    } else {
        return res.end('Authentication Required', 403);
    }
};

exports.validateClaims = function (req, res, next) {
    req.user = null;
    exports.validateToken(req, res, function () {
        if (!req.body.clientid && !req.body.apiid)
            return res.end('No claims requested', 400);
        var email = req.auth.email;
        User.findOne({ email: req.auth.email }).populate('clients').populate('apis')
            .then(result => {
                if (result.length == 0)
                    return res.end('User not found', 400);
                if (req.body.clientid) {
                    if (result.clients.filter(item => item.clientId === req.body.clientid).length > 0)
                        req.user = result.toJson();
                    else {
                        return res.end('Invalid API claim requested', 400);
                    }

                }
                if (req.body.apiid) {
                    var t = result.apis.filter(item => item.apiId === req.body.apiid);
                    var x = t.length
                    if (result.apis.filter(item => item.apiId === req.body.apiid).length > 0)
                        req.user = result.toJson();
                    else
                        return res.end('Invalid API claim requested', 400);
                }
                if (req.user)
                    next();
                else
                    res.end('Invalid claims request', 400);
            })
            .catch(err => {
                res.end(err, 400);
            });
    });
}


exports.validateRolesAny = function (roles) {
    return function (req, res, next) {
        exports.validateClaims(req, res, function () {
            var validRoles=req.user.roles.filter(function(role){
                if (role.roletype==="client"  && role.clientId===req.body.clientid)
                    return true;
                else if (role.roletype=="api" && role.apiId===req.body.apiid)
                    return true;
                return false;
            }).map(role=>role.roles);
            if (validRoles.length==0)
                return res.end('invalid role request',400);
            var finalRoles=validRoles[0].filter(function(item){
                return roles.indexOf(item)!=-1;
            });
            if (finalRoles.length==0)
                return res.end('invalid role request',400);
            return next();
        });
    }
}

exports.validateRolesAll = function (roles) {
    return function (req, res, next) {
        exports.validateClaims(req, res, function () {
            var validRoles=req.user.roles.filter(function(role){
                if (role.roletype==="client"  && role.clientId===req.body.clientid)
                    return true;
                else if (role.roletype=="api" && role.apiId===req.body.apiid)
                    return true;
                return false;
            }).map(role=>role.roles);
            if (validRoles.length==0)
                return res.end('invalid role request',400);
            var finalRoles=validRoles[0].filter(function(item){
                return roles.indexOf(item)!=-1;
            });
            if (finalRoles.length!=roles.length)
                return res.end('invalid role request',400);
            return next();
        });
    }
}
