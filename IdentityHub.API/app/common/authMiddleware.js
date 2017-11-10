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
                return res.status(400).send('Invalid access token provided');
            }
            User.findOne({ email: req.auth.email }).populate('clients').populate('apis')
                .then(result => {
                    req.user = result.toJson();
                    next();
                })
                .catch(err => {
                    res.status(400).send(err.message);
                });
        } catch (err) {
            return res.status(400).send(err.message);
        }
    } else {
        return res.status(403).send('Authentication Required');
    }
};

exports.validateClaims = function (req, res, next) {
    req.user = null;
    let clientid = req.body.clientid;
    let apiid = req.body.apiid;
    if (req.method === "GET") {
        if (req.url.indexOf('client') !== -1) {
            clientid = req.params['id'];
        }
        else {
            apiid = req.params['id'];
        }
    }
    exports.validateToken(req, res, function () {
        if (!clientid && !apiid)
            return res.status(400).send('No claims requested');
        if (clientid && apiid) {
            return res.status(400).send('invalid claims requested');
        }
        var email = req.auth.email;
        User.findOne({ email: req.auth.email }).populate('clients').populate('apis')
            .then(result => {
                if (!result)
                    return res.status(400).send('User not found');
                if (clientid) {
                    if (result.clients.filter(item => item.clientId === clientid).length > 0)
                        req.user = result.toJson();
                    else {
                        return res.status(400).send('Invalid API claim requested');
                    }

                }
                if (apiid) {
                    var t = result.apis.filter(item => item.apiId === apiid);
                    var x = t.length
                    if (result.apis.filter(item => item.apiId === apiid).length > 0)
                        req.user = result.toJson();
                    else
                        return res.status(400).send('Invalid API claim requested');
                }
                if (req.user)
                    next();
                else
                    res.status(400).send('Invalid claims request');
            })
            .catch(err => {
                res.status(400).send(err.message);
            });
    });
}

const _checkRoles = function (user, clientid, apiid, roles) {
    var validRoles = user.roles.filter(function (role) {
        if (role.roletype === "client" && role.parentId === clientid)
            return true;
        else if (role.roletype == "api" && role.parentId === apiid)
            return true;
        return false;
    }).map(role => role.roles);
    if (validRoles.length == 0)
        return [];
    return validRoles[0].filter(function (item) {
        return roles.indexOf(item) != -1;
    });

}

exports.validateRolesAny = function (roles) {
    return function (req, res, next) {
        let clientid = req.body.clientid;
        let apiid = req.body.apiid;
        if (req.method === "GET") {
            if (req.url.indexOf('client') !== -1) {
                clientid = req.params['id'];
            }
            else {
                apiid = req.params['id'];
            }
        }
        exports.validateClaims(req, res, function () {
            if (_checkRoles(req.user, clientid, apiid, roles).length == 0)
                return res.status(400).send('invalid role request');
            return next();
        });
    }
}

exports.validateRolesAll = function (roles) {
    return function (req, res, next) {
        let clientid = req.body.clientid;
        let apiid = req.body.apiid;
        if (req.method === "GET") {
            if (req.url.indexOf('client') !== -1) {
                clientid = req.params['id'];
            }
            else {
                apiid = req.params['id'];
            }
        }
        exports.validateClaims(req, res, function () {
            if (_checkRoles(req.user, clientid, apiid, roles).length !== roles.length)
                return res.status(400).send('invalid role request');
            return next();
        });
    }
}