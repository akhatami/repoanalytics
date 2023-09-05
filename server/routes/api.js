const express = require('express');
const router = express.Router();

const Repository = require('../models/Repository');
const Codecov = require('../models/Codecov');
const Coveralls = require('../models/Coveralls');

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

router.get('/codecov/:user/:repo_name', async (req, res) => {
    const user = req.params.user;
    const repo_name = req.params.repo_name;
    const name = user + '/' + repo_name;
    let data;
    try {
        data = await Codecov.find({'repo_name': name});
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
            .sort({'created_at': 1});
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

module.exports = router;