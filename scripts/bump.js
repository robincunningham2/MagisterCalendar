#!/usr/local/bin/node
/**
 * Bump the version on package.json and package-lock.json
 * Yes, I realise how shitty this script is
 * No, I don't plan on doing anything about it
 *
 * Usage:
 *   npm run bump [x.x.x]
 *   npm run bump [major|minor|patch]
 */

const fs = require('fs');

const package = require('../package.json');
const packageLock = require('../package-lock.json');

function bump(bumping) {
    let version = package.version.split('.');
    let toBump = 2;

    if (bumping == 'major') toBump = 0;
    else if (bumping == 'minor') toBump = 1;
    else if (bumping == 'patch') toBump = 2;
    else if (bumping.indexOf('.')) {
        version = bumping.split('.');
        toBump = -1;
    }

    version[toBump]++;
    version = version.join('.');

    package.version = version;
    packageLock.version = version;

    return Promise.all([
        new Promise((resolve) => fs.writeFile('package.json', JSON.stringify(package, null, 2) + '\n', resolve)),
        new Promise((resolve) => fs.writeFile('package-lock.json',
            JSON.stringify(packageLock, null, 2) + '\n', resolve)),
    ]);
}

function cli() {
    let bumping = process.argv[1] || '';
    if ((process.argv0 || '').indexOf('node') != -1) bumping = process.argv[2] || '';

    bump(bumping).then(() => console.log(`Bumped the version to ${package.version}`));
}

cli();
