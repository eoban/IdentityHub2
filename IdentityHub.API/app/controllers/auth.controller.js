const jwt = require('jsonwebtoken');

const config=require('../config/config'),
    User=require('../models/user'),
    Domain=require('../models/domain'),
    Client=require('../models/client');

exports.token=function(req,res,next){
    User.findOne({ email: req.body.email }).populate("clients").populate("domains").then(function (user, err) {
        if (err) { return res.status(400).json({ error: "bad data" }); }
        if (!user) { return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' }); }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (err) { return res.status(400).json({ error: "bad data" }); }
            if (!isMatch) { return res.status(400).json({ error: 'Your login details could not be verified. Please try again.' }); }
            if (!req.body.clientid) {
                res.status(400).json({ error: "bad data" });                
            } else if (user.clients.filter(function (item) { return item.clientId === req.body.clientid; }).length === 0) {
                res.status(400).json({ error: "client not authorized" });
            } else if (!req.body.domainid){
                res.status(400).json({ error: "bad data" });
            }else if (user.domains.filter(function (item) { return item.domainId === req.body.domainid; }).length === 0){
                res.status(400).json({error: "domain not authorized"})
            }else{
                let userInfo = user.toJson();
                res.status(200).json({
                    token: 'Bearer ' +jwt.sign(userInfo, config.secret, {
                        expiresIn: 10080 // in seconds
                    }),
                    user: userInfo
                 });
            }
        });
    });
}

exports.register=function(req,res,next){
    res.status(200).json({ok: true});    
}

exports.authorizeClient=function(req,res,next){
    res.status(200).json({ok: true});    
}

exports.authorizeApi=function(req,res,next){
    res.status(200).json({ok: true});    
}