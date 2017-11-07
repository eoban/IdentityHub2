const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId=Schema.Types.ObjectId;


const ProviderSchema = new Schema({
    user: [{
        type: ObjectId,
        ref: 'User'
    }],
    providerType: {
        type: String,
        required: true,
        lowercase: true
    },
    CurrentKey: {
        type: String,
    },
    KeyExpires:{
            type: Date
    }
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Provider', ProviderSchema);
