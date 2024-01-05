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

router.get('/repos_coverage', async (req, res) => {
    try {
        // Get the latest covered_percent for each repo
        const latestReposCoveralls = await Coveralls.aggregate([
            {
                $sort: { created_at: -1 }, // Sort by created_at in descending order
            },
            {
                $group: {
                    _id: '$repo_name',
                    latest_covered_percent: { $first: '$covered_percent' },
                },
            },
        ]);
        const latestReposCodecov = await Codecov.aggregate([
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: '$repo_name',
                    latest_covered_percent: { $first: '$avg' },
                },
            },
        ]);

        // Merge the results from both collections
        const mergedRepos = [...latestReposCoveralls, ...latestReposCodecov];
        res.json(mergedRepos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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

// index is manually added on 'createdAt' field and also 'repository' field
router.get('/pulls/all', async (req, res) => {
    try {
        const targetPullsPerRepository = 100;

        const allData = await PullRequest.find().sort({ 'createdAt': -1 });

        // Group data by repository
        const groupedData = allData.reduce((acc, entry) => {
            const repositoryId = entry.repository;
            if (!acc[repositoryId]) {
                acc[repositoryId] = { _id: repositoryId, pulls: [] };
            }
            acc[repositoryId].pulls.push(entry);
            return acc;
        }, {});

        console.log('groupedData', groupedData);

        // Filter the latest 100 pull requests for each repository
        const filteredData = Object.values(groupedData).map(repository => ({
            _id: repository._id,
            pulls: repository.pulls.slice(0, targetPullsPerRepository)
        }));

        // Log count of repositories in the first level
        console.log('Repository count:', Object.keys(groupedData).length);

        // Log count of pull requests per repository in the second level
        console.log('Pull requests per repository count:', filteredData.map(repo => repo.pulls.length));

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching all pull requests:', error);
        res.json(['NOT FOUND']);
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
