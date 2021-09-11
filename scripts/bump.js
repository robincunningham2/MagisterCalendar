#!/usr/local/bin/node
/**
 * Easily change the version in the package.json and package-lock.json files
 *
 * Usage:
 *   npm run bump [n.n.n|keyword]?
 * 
 * Examples:
 *   npm run bump 1.0.0     Change the version to 1.0.0
 *   npm run bump major     Increase the major value of the current version, and set the minor and patch values to 0
 *   npm run bump patch     Increase the patch value of the current version
 *   npm run bump           Same as `npm run bump patch`
 */

const fs = require('fs');

const package = require('../package.json');
const packageLock = require('../package-lock.json');

function cli() {
    const oldVersion = package.version;
    let version = oldVersion.split('.');

    let arg = process.argv[1] || '';
    if ((process.argv0 || '').indexOf('node') != -1) arg = process.argv[2] || '';

    if (arg.indexOf('.') != -1) version = arg;
    else if (arg == 'major') version = `${Number(version[0]) + 1}.0.0`;
    else if (arg == 'minor') version = `${version[0]}.${Number(version[1]) + 1}.0`;
    else version = `${version.slice(0, 2).join('.')}.${Number(version[2]) + 1}`;

    package.version = version;
    packageLock.version = version;

    fs.writeFileSync('package.json', JSON.stringify(package, null, 2) + '\n');
    fs.writeFileSync('package-lock.json', JSON.stringify(packageLock, null, 2) + '\n');

    console.log(`Bumped the version to ${version} from ${oldVersion}`);
}

cli();
