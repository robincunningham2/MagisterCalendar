const config = require('../../config/index');
const { OAuth2 } = require('../../src/googleServices');

const express = require('express');
const api = express.Router();

const OAUTH_OPTIONS = {
    client_id: config.credentials.web.client_id,
    client_secret: config.credentials.web.client_secret,
    redirect_uri: config.credentials.web.redirect_uris[0],
    scopes: config.googleApis.scopes,
};

api.get('/endpoints', (_, res) => {
    res.json({
        endpoints: [
            'GET /api/v1/endpoints',
            'GET /api/v1/generateAuthUrl',
            'GET /api/v1/redirectOAuth',
        ],
    });
});

api.get('/generateAuthUrl', (_, res) => {
    res.redirect(302, OAuth2.generateAuthUrl(OAUTH_OPTIONS));
});

api.get('/redirectOAuth', async (req, res) => {
    if (!req.query.code) {
        return res.status(400).json({
            status: 400,
            message: 'Query parameter `?code=string` is required',
        });
    }

    let token;
    try {
        token = await OAuth2.generateTokenFile(OAUTH_OPTIONS, req.query.code);
    } catch {
        return res.status(500).json({
            status: 500,
            message: 'Invalid code',
        });
    }

    req.session.tokenFile = token;
    res.redirect(302, '/signup');
});

api.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: `The request URL was not found. See ${req.protocol}://${req.get('Host')}/api/v1/endpoints ` +
            'for all the endpoints',
    });
});

module.exports = api;
