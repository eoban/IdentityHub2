const authSvc=require('../services/auth.service');

exports.token=function(req,res,next){
    authSvc.login(req.body.email,req.body.password,req.body.clientid)
        .then(result=>res.status(200).json(result))
        .catch(err=>res.status(400).json(err));
}

exports.register=function(req,res,next){
    res.status(200).json({ok: true});    
}

exports.getAuthenticatedUser=function(req,res,next){
    res.status(200).json({user: req.user});
}