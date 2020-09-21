const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const category = mongoose.Schema({
    name: { type: String, required: true, unique: true},
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Projects'}]
})

category.plugin(uniqueValidator);

module.exports = mongoose.model('Category', category);