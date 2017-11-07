const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId=Schema.ObjectId;


const ClientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    authorizedApis:
        [{
            type: ObjectId,
            ref: 'Api'
        }]
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Client', ClientSchema);
