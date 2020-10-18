const mongoose = require('mongoose');

const activties = mongoose.Schema({
    date: { type: String, required: true },
    title: { type: String, required: true },
    operation: { type: String, required: true }
});

const activity = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true, unique: true },
    email_id: { type: String, required: true, unique: true},
    activity: [ activties ]
});


module.exports = mongoose.model('Activity', activity);