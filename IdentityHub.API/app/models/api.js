const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ApiSchema = new Schema({
name: {
    type: String,
    required: true
},
ApiId: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
},
},
{
    timestamps: true,
});

module.exports = mongoose.model('Api', ApiSchema);
