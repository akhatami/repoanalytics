const mongoose = require('mongoose');

const repositoryDetailsSchema = new mongoose.Schema({
    id: String,
    repository: String,
    name: String,
    homepageUrl: String,
    createdAt: String,
    pushedAt: String,
    updatedAt: String,
    description: String,
    stargazerCount: Number,
    forkCount: Number,
    watcherCount: Number,
    primaryLanguage: JSON,
    latestRelease: JSON,
    licenseInfo: JSON,
    codeOfConduct: JSON,
    contributingGuidelines: JSON,
    issueTemplates: JSON,
    issueCount: Number,
    pullRequestCount: Number,
    pullRequestTemplates: Array(JSON),
    assignableUsers: JSON,
    labels: JSON,
    languages: JSON
}, {collection: 'repository_details'});

module.exports = mongoose.model('RepositoryDetails', repositoryDetailsSchema);
