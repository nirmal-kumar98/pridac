const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const category = mongoose.Schema({
    user: { type: Boolean, required: true, unique: true, defaule: false},
    signup: { type: Boolean, required: true, unique: true, defaule: false},
    userCanLogin: { type: Boolean, required: true, unique: true, defaule: false},
    userCanSettings: { type: Boolean, required: true, unique: true, defaule: false},
    forgotPassword: { type: Boolean, required: true, unique: true, defaule: false}
})

category.plugin(uniqueValidator);

module.exports = mongoose.model('Settings', category);