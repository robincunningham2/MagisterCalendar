#!/usr/local/bin/node
const config = require('../config/index');
const google = require('../src/googleServices');

const fs = require('fs');

if (fs.existsSync('.cache/token.json')) {
    console.log('You are already authorized! To re-authorize, delete the .cache folder and try again.');
    process.exit(0);
}

(async () => {
    const auth = new google.OAuth2({
        client_id: config.credentials.installed.client_id,
        client_secret: config.credentials.installed.client_secret,
        redirect_uri: config.credentials.installed.redirect_uris[0],
        scopes: config.scopes,
        callback: google.defaults.DESKTOP_CALLBACK,
    });

    const { token } = await auth.auth;

    if (!fs.existsSync('.cache/')) fs.mkdirSync('.cache/');
    fs.writeFileSync('.cache/token.json', JSON.stringify(token));

    console.log('Successfully authorized.');
})();
