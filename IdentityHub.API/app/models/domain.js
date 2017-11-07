const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const DomainSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    domainId: {
        type: String,
        unique: true,
        required: true
    },
    users:[{
        type: ObjectId,
        ref: 'User'
    }]
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Domain', DomainSchema);
