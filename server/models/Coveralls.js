const mongoose = require('mongoose');

const coverallsSchema = new mongoose.Schema({
    repo_name: String,
    created_at: String,
    commit_sha: String,
    badge_url: String,
    branch: String,
    covered_percent: Number,
    covered_lines: Number,
    relevant_lines: Number
}, {collection: 'coveralls_coverage'});

module.exports = mongoose.model('Coveralls', coverallsSchema);
