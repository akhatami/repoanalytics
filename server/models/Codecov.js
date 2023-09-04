const mongoose = require('mongoose');

const codecovSchema = new mongoose.Schema({
    repo_name: String,
    timestamp: String,
    min: Number,
    max: Number,
    avg: Number
}, {collection: 'codecov_coverage_trend'});

module.exports = mongoose.model('Codecov', codecovSchema);
