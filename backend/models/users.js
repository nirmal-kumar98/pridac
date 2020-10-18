const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const users = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    position: { type: String, required: true },
    user_type: { type: String, required: true },
    email_id: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    status: { type: Boolean, required: false, default: false},
    verified: { type: Boolean, required: false, default: false},
    phone_number: { type: String, required: true, unique: true},
    created_date: { type: String, required: true},
    updated_date: { type: String, required: false},
    profile_pic: { type: String, required: false, default: 'https://www.uokpl.rs/fpng/f/426-4262792_default-avatar-png.png'},
    password_modified_date: { type: String, required: false },
    teams: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Teams' } ]
});

users.plugin(uniqueValidator);
module.exports = mongoose.model('Users', users);