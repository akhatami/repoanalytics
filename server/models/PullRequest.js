const mongoose = require('mongoose');

const pullRequestSchema = new mongoose.Schema({
    id: String,
    merged: Boolean,
    participants: JSON,
    createdAt: String,
    mergedAt: String,
    changedFiles: Number,
    additions: Number,
    checksUrl: String,
    comments: JSON,
    closed: Boolean,
    deletions: Number,
    number: Number,
    reviewDecision: String,
    state: String,
    url: String,
    assignees: JSON,
    author: JSON,
    commits: JSON,
    permalink: String,
    repository: String,
    reviews: JSON,
    reviewRequests: JSON,
    reviewThreads: JSON,
    totalCommentsCount: Number
}, {collection: 'pull_request'});

module.exports = mongoose.model('PullRequest', pullRequestSchema);
