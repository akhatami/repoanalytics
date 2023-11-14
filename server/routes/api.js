const express = require('express');
const router = express.Router();

const Repository = require('../models/Repository');
const Codecov = require('../models/Codecov');
const Coveralls = require('../models/Coveralls');
const PullRequest = require('../models/PullRequest');
const CommitStatusCheck = require('../models/CommitStatusCheck');
const RepositoryDetails = require('../models/RepositoryDetails');

router.get('/repositories', async (req, res) => {
    const page = Math.max(req.query.page, 1);
    const perPage = req.query.perPage;

    const options = {
        page,
        limit: perPage
    };

    const repositories = await Repository.find()
        .skip((page - 1) * perPage)
        .limit(perPage);

    const repositoriesTotal = await Repository.countDocuments();

    res.json({repositories, repositoriesTotal});
});

router.get('/repositoriesCount', async (req, res) => {

    const repositoriesTotal = await Repository.countDocuments();

    res.json({repositoriesTotal});
});

const { subDays } = require('date-fns');

router.get('/recentRepositoriesCount', async (req, res) => {
    const thirtyDaysAgo = subDays(new Date(), 45);

    const count = await RepositoryDetails.countDocuments({
        updatedAt: {
            $gte: thirtyDaysAgo.toISOString()
        }
    });

    res.json({count});
});

router.get('/repo/:user/:repo_name', async (req, res) => {
    const user = req.params.user;
    const repo_name = req.params.repo_name;
    const name = user + '/' + repo_name;
    let data;
    try {
        data = await Repository.find({'name': name});
    } catch (error) {
        console.error('Error fetching repo details:', error);
        data = [{}];
    }
    if (Object.keys(data).length === 0){
        res.json(['NOT FOUND']);
    } else {
        res.json(data[0]);
    }
});

router.get('/repo_details/:user/:repo_name', async (req, res) => {
    const user = req.params.user;
    const repo_name = req.params.repo_name;
    const repo_handle = user + '/' + repo_name;
    let data;
    try {
        data = await RepositoryDetails.find({'repository': repo_handle});
    } catch (error) {
        console.error('Error fetching repo details:', error);
        data = [{}];
    }
    if (Object.keys(data).length === 0){
        res.json(['NOT FOUND']);
    } else {
        res.json(data[0]);
    }
});

router.get('/codecov/:user/:repo_name', async (req, res) => {
    const user = req.params.user;
    const repo_name = req.params.repo_name;
    const name = user + '/' + repo_name;
    let data;
    try {
        data = await Codecov.find({'repo_name': name}).sort({'timestamp': -1}).limit(50);
    } catch (error) {
        console.error('Error fetching Codecov details:', error);
        data = [];
    }
    if (Object.keys(data).length === 0){
        res.json(['NOT FOUND']);
    } else {
        res.json(data);
    }
});

router.get('/coveralls/:user/:repo_name', async (req, res) => {
    const user = req.params.user;
    const repo_name = req.params.repo_name;
    const name = user + '/' + repo_name;

    let repo;
    let default_branch;
    let data;

    try {
        repo = await Repository.find({'name': { $regex: new RegExp("^" + name.toLowerCase(), "i") }});
        default_branch = repo[0]['default_branch'];
    } catch (error) {
        console.error('Error fetching Coveralls details:', error);
        return;
    }


    try {
        data = await Coveralls.find({'repo_name': { $regex: new RegExp("^" + name.toLowerCase(), "i") },
            'branch': { $regex: new RegExp("^" + default_branch.toLowerCase(), "i") }})
            .sort({'created_at': -1}).limit(50);
    } catch (error) {
        console.error('Error fetching Codecov details:', error);
        return;
    }

    if (Object.keys(data).length === 0){
        res.json(['NOT FOUND']);
    } else {
        res.json(data);
    }
});

router.get('/pulls/:user/:repo_name', async (req, res) => {
    const user = req.params.user;
    const repo_name = req.params.repo_name;
    const name = user + '/' + repo_name;
    let data;
    try {
        data = await PullRequest.find({'repository': name}).sort({'createdAt': -1}).limit(100);
    } catch (error) {
        console.error('Error fetching repo details:', error);
        data = [{}];
    }
    if (Object.keys(data).length === 0){
        res.json(['NOT FOUND']);
    } else {
        res.json(data);
    }
});

router.get('/statusChecks/:user/:repo_name/:pull_number', async (req, res) => {
    const user = req.params.user;
    const repo_name = req.params.repo_name;
    const pull_number = req.params.pull_number;

    const name = user + '/' + repo_name;

    let data;
    try {
        data = await CommitStatusCheck.find({'repository': name, 'pull_request_number': pull_number});
    } catch (error) {
        console.error('Error fetching status check details:', error);
        data = [{}];
    }
    if (Object.keys(data).length === 0){
        res.json(['NOT FOUND']);
    } else {
        res.json(data);
    }
});

router.get('/statusChecksMultiple/:user/:repo_name/:limit', async (req, res) => {
    const user = req.params.user;
    const repo_name = req.params.repo_name;
    const limit = req.params.limit;

    const name = user + '/' + repo_name;
    console.log(limit, user, repo_name);
    let data;
    try {
        // Step 1: Retrieve the latest 100 PR numbers
        const latestPRs = await CommitStatusCheck.aggregate([
            { $match: { repository: name } },
            { $group: { _id: '$pull_request_number' } },
            { $sort: { _id: -1 } },
            { $limit: parseInt(limit) },
        ]);

        // Extract PR numbers from the aggregation result
        const prNumbers = latestPRs.map(pr => pr._id);

        // Step 2: Retrieve status checks for the latest 100 PRs
        data = await CommitStatusCheck.find({
            'repository': name,
            'pull_request_number': { $in: prNumbers }
        });
    } catch (error) {
        console.error('Error fetching status check details:', error);
        data = [{}];
    }
    if (Object.keys(data).length === 0){
        res.json(['NOT FOUND']);
    } else {
        res.json(data);
    }
});

module.exports = router;
