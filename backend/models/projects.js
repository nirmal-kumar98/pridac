const mongoose = require('mongoose');

const projects = mongoose.Schema({
    name: { type: String, required: true},
    code: { type: String, required: true},
    description: { type: String, required: true },
    status: { type: String, required: true},
    location: { type: String, required: true},
    category: { type: String, required: true},
    construction_date: { type: String, required: true},
    value: { type: String, required: true},
    iconic_image: { type: String, required: true},
    created_ts: { type: String, required: true},
    created_by: { type: String, required: true},
    images: [ { type: String, required: false} ]
});


module.exports = mongoose.model('Projects', projects);