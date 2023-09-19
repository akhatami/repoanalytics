const mongoose = require('mongoose');

const commitStatusCheckSchema = new mongoose.Schema({
    repository: String,
    pull_request_number: Number,
    pull_request_id: String,
    commits_count: Number,
    commits_url: String,
    commit_message: String,
    commit_oid: String,
    commit_id: String,
    status_check_rollup_state: String,
    status_check_rollup_id: Number,
    contexts_total_count: Number,
    contexts_checkRun_count: Number,
    contexts: JSON
}, {collection: 'commit_status_check'});

module.exports = mongoose.model('CommitStatusCheck', commitStatusCheckSchema);
