// make request accesible inside app.get
const request = require('request'); 

// server.js
const express = require('express');


// Require the config 
// put everything secret in the gitignored config.js file
const config = require('./config.js');
// Codecov API Token
const codecov_token = config.CODECOV_TOKEN;
const sdk = require('api')('@codecov/v5.0#es2zlg5p5t54');


const app = express();

// API routes will go here

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
  });

app.get('/api', (req, res) => {
    res.json({message: 'API root'});
  });

app.get('/api/repositories/:owner_username/:repo_name', (req, res) => {

    sdk.auth(`${codecov_token}`);
    sdk.repos_coverage_list({
      interval: '30d',
      service: 'github',
      owner_username: req.params.owner_username,
      repo_name: req.params.repo_name
    })
      .then(({ data }) => res.json({message: data}))
      .catch(err => res.send(err));
});
