const jwt = require('jsonwebtoken');

const config=require('../config/config'),
    User=require('../models/auth/user'),
    Client=require('../models/auth/client');

exports.login=function(userName,password,client){
    return new Promise(function(resolve,reject){
        User.findOne({ email: userName }).populate("clients").then(function (user, err) {
            if (err) { return reject({ error: "bad data" }); }
            if (!user) { return reject({ error: 'Your login details could not be verified. Please try again.' }); }
            user.comparePassword(password, function (err, isMatch) {
                if (err) { return reject({ error: "bad data" }); }
                if (!isMatch) { return reject({ error: 'Your login details could not be verified. Please try again.' }); }
                if (!client) {
                    return reject({ error: "bad data" });                
                } else if (user.clients.filter(function (item) { return item.clientId === client; }).length === 0) {
                    return reject({ error: "client not authorized" });
                } else{
                    let userInfo = user.toJson();
                    return resolve({
                        token: 'Bearer ' +jwt.sign(userInfo, config.secret, {
                            expiresIn: 10080 // in seconds
                        }),
                        user: userInfo
                     });
                }
            });
        });
    });
}