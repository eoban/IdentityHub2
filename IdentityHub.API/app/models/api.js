const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const ApiSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    apiId: {
        type: String,
        unique: true,
        required: true
    },
    domain: {
        type: ObjectId,
        ref: 'Domain'
    }
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Api', ApiSchema);
