const express = require('express')
const path = require("path");

const url = require('url');
const proxy = require('express-http-proxy');

const port = 80
const authProxyPort = 3000

const app = express()

// New hostname+path as specified by question:
const authProxy = proxy(`localhost:${authProxyPort}`, {
    proxyReqPathResolver: req => url.parse(req.originalUrl).path
});

// Serve all files in 'public' folder
app.use(express.static('public'))

app.get('/netlify-cms.js', (req, res) => {
    res.sendFile(
        './dist/netlify-cms.js',
        { root: __dirname }
    );
});

app.get('/netlify-cms.js.map', (req, res) => {
    res.sendFile(
        './dist/netlify-cms.js.map',
        { root: __dirname }
    );
});

app.get('/config.yml', (req, res) => {
    res.sendFile(
        './config.yml',
        { root: path.join(__dirname, "..")
    });
});

app.use('/auth', authProxy);
app.use('/callback', authProxy);

app.listen(port, () => {
  console.log(`Netlify CMS listening on port ${port}...`)
})
