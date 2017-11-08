const mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    jwt=require('jsonwebtoken'),
    config=require('../../config/config');
   
const Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

const UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    clients: [{
        type: ObjectId,
        ref: 'Client'
    }],
    apis: [{
        type: ObjectId,
        ref: 'Api'
    }],
    providers: [{
        type: ObjectId,
        ref: 'Provider'
    }]
},
    {
        timestamps: true,
    });

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
    const user = this,
        SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.toJson=function(){
    return {email: this.email};
}
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    if (this.password === '*') { cb(null, false); return; }
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) { return cb(err); }

        cb(null, isMatch);
    });
}

UserSchema.methods.toToken=function(){
    let userInfo=this.toJson();
    return {
        token: 'Bearer ' +jwt.sign(userInfo, config.secret, {
            expiresIn: 10080 // in seconds
        }),
        user: userInfo
     }
}
UserSchema.statics.fromToken=function(token){
    let temp=token.token.substring(7);
    let v=jwt
    let email=jwt.decode(temp);
    let x=1;
}

module.exports = mongoose.model('User', UserSchema);
