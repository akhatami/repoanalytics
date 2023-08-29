const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
    name: String,
    language: String,
    default_branch: String,
    has_codecov: Number,
    has_coveralls: Number,
    has_codeclimate: Number,
    created_at: Number,
    updated_at: Number
}, {collection: 'repository'});

module.exports = mongoose.model('Repository', repositorySchema);
