const express = require('express');
const path = require('path');

const port = 80;

const app = express();

// Serve all files in 'public' folder
app.use(express.static('public'))

// Serve CMS source files
app.use('/cms', express.static('./app/dist'))

app.get('/config.yml', (req, res) => {
    res.sendFile(
        './config.yml',
        { root: path.join(__dirname, "..")
    });
});

// Pass requests to OAuth routes to `netlify-cms-github-oauth-provider` project
const oauth_provider_app = require('../netlify-cms-github-oauth-provider/app.js');
app.use('/auth', function(req, res, next) {
    req.url = '/auth';
    oauth_provider_app(req, res, next)
});
app.use('/callback', function(req, res, next) {
    req.url = '/callback';
    oauth_provider_app(req, res, next)
});

app.listen(port, () => {
  console.log(`Static CMS listening on port ${port}`)
})
