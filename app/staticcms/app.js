const express = require('express');
const path = require('path');

const port = 8080

const app = express();

// Serve all files in 'public' folder
const publicHandler = express.static('public')
app.use(publicHandler)
app.use('/admin', publicHandler)

// Serve CMS source files
const cmsHandler = express.static('./app/dist');
app.use('/cms', express.static('./app/dist'))
app.use('/admin/cms', express.static('./app/dist'))

const configHandler = (req, res) => {
    res.sendFile(
        './config.yml',
        { root: path.join(__dirname, "..")
        });
};
app.get('/config.yml', configHandler);
app.get('/admin/config.yml', configHandler);

// Pass requests to OAuth routes to `netlify-cms-github-oauth-provider` project
const oauth_provider_app = require('../netlify-cms-github-oauth-provider/app.js');
const authHandler = function(req, res, next) {
    req.url = '/auth';
    oauth_provider_app(req, res, next)
};
app.use('/auth', authHandler);
app.use('/admin/auth', authHandler);

const callbackHandler = function(req, res, next) {
    req.url = '/callback';
    oauth_provider_app(req, res, next)
};
app.use('/callback', callbackHandler);
app.use('/admin/callback', callbackHandler);

app.listen(port, () => {
  console.log(`Static CMS listening on port ${port}`)
})
