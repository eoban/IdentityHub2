const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectID=Schema.ObjectID;


const ClientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ClientId: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    // AuthorizedApis:
    //     [{
    //         type: ObjectID,
    //         ref: 'Api'
    //     }]
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Client', ClientSchema);
