const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DomainSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    domainId: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('Domain', DomainSchema);
