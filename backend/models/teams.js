const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const teams = mongoose.Schema({
    name: { type: String, required: true },
    members: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Users' } ],
    created_ts: { type: String, required: true},
    home: { type: Boolean, default: false},
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
});

module.exports = mongoose.model('Teams', teams);