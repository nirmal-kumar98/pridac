const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const home = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects', required: true, unique: true },
    order: { type: Number, required: true}
});

home.plugin(uniqueValidator);
module.exports = mongoose.model('Home', home);