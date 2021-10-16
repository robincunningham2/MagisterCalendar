#!/usr/local/bin/node
const readline = require('readline');
const chalk = require('chalk');
const fs = require('fs');

fs.mkdirSync('.tmp/');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl._writeToOutput = (string) => {
    if (!rl.muted) rl.output.write(string);
};

function question(query, options = { password: false, default: null }) {
    query = `${chalk.keyword('orange')('?')} ${chalk.bold(`${query}:`)} `;
    if (options.default) query += `(${options.default}) `;

    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            rl.muted = false;
            if (options.password == true) console.log();
            if (options.default) answer ||= options.default;

            let output = '\033[F' + chalk.green('✔');
            if (!options.password) output += query.slice(18) + chalk.keyword('orange')(answer);
            rl.output.write(output + '\n');

            resolve(answer);
        });

        if (options.password == true) rl.muted = true;
    });
}

const config = {
    settings: {
        magister: {
            schoolId: 'placeholder_value',
            userId: 'placeholder_value',
            password: 'placeholder_value',
        },
        calendar: 'placeholder_value',
        timeZone: 'placeholder_value',
        defaultLocationName: 'placeholder_value',
        defaultDescription: 'placeholder_value',
        reminders: { useDefault: false },
    },
    scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/user.emails.read',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
    ],
    functions: {
        filter: ($) => $.Status != 4,
        summary: ($) => {
            if ($.LesuurVan) {
                let string = `#${$.LesuurVan} `;
                string += $.Vakken[0].Naam[0].toUpperCase() + $.Vakken[0].Naam.slice(1);
                string += ` - ${$.Docenten[0].Docentcode}`;
                return string;
            } else {
                return $.Inhoud;
            }
        },
        color: ($) => undefined,
    },
};

(async () => {
    config.settings.magister.schoolId = await question('Enter your magister school ID');
    config.settings.magister.userId = await question('Enter your magister user ID');
    config.settings.magister.password = await question('Enter your magister password', { password: true });

    config.settings.calendar = await question('Select a calendar', { password: true, default: 'primary' });
    config.settings.timeZone = await question('Set a timezone', { password: true, default: 'Europe/Amsterdam' });
    config.settings.defaultLocationName = await question('Default location tag', {
        password: true,
        default: 'Niet bekend',
    });

    config.settings.defaultDescription = await question(
        'Default description (allows HTML)',
        { password: true, default: '<i>Geen inhoud</i>' },
    );

    let saveAs;
    while (true) {
        const result = await question('File format (.json or .js)');
        if (result == '.json' || result == 'json') saveAs = '.json';
        else if (result == '.js' || result == 'js') saveAs = '.js';
        else {
            console.log('\033[F' + chalk.red('✘'));
            console.log('Invalid file type' + (result.length ? `: ${result}` : '') + ', try again');
            continue;
        }

        break;
    }

    let file;
    if (saveAs == '.js') file = 'module.exports = ' + serialize(config);
    else {
        file = JSON.stringify(config, (_, v) => {
            if (typeof v == 'function') return { '$type': 'function', '$function': v.toString() };
            return v;
        }, 2) + '\n';
    }

    fs.writeFileSync('.magistercalendarrc' + saveAs, file);
    console.log('Saved to .magistercalendarrc' + saveAs);

    rl.close();
})();

function serialize(v, options = { indent: 4, f: false }) {
    if (typeof options.indent == 'number') options.indent = ' '.repeat(options.indent);

    if (typeof v == 'string') return `'${JSON.stringify(v).slice(1, -1)}'`;
    else if (typeof v == 'number') return String(v);
    else if (typeof v == 'boolean') return String(v);
    else if (typeof v == 'function') {
        v = v.toString();
        let i = Math.min(...v.split('\n').map((l) => Math.abs(l.trim().length - l.length)).filter((x) => !!x)) + 4;
        if (i == Infinity || !i) i = 0;

        return v.split('\n').map((l) => l.slice(i).length ? l.slice(i) : (l.slice(i - 4).length ? l.slice(i - 4) : l))
            .join('\n');
    } else if (typeof v == 'symbol') return Symbol.toString();
    else if (v == null) return 'null';
    else if (v == undefined) return 'undefined';
    else if (v instanceof Date) return `new Date(${Number(v)})`;
    else if (v instanceof Array) {
        const out = [ '[' ];
        v.forEach((e) => {
            const splitted = serialize(e, { ...options, f: true }).split('\n');
            const value = splitted.length > 1 ? [
                splitted[0],
                splitted.slice(1, -1).map((l) => options.indent + l).join('\n'),
                splitted.slice(-1)[0],
            ].join('\n') : splitted.join('\n');
            out.push(value + ',');
        });

        out.push(']');
        return out.join('\n');
    } else if (v instanceof Object) {
        const out = [ '{' ];
        for (const k in v) {
            if (v.hasOwnProperty(k)) {
                const splitted = serialize(v[k], { ...options, f: true }).split('\n');
                const value = splitted.length > 1 ? [
                    splitted[0],
                    splitted.slice(1, -1).map((l) => options.indent + l).join('\n'),
                    splitted.slice(-1)[0],
                ].join('\n') : splitted.join('\n');

                if (!options.f) out.push(`${k}: ${value},`.split('\n').map((l) => options.indent + l).join('\n'));
                else out.push(`${k}: ${value},`);
            }
        }

        out.push('}');
        return options.f ? out.join('\n') : out.join('\n') + '\n';
    } else return 'undefined';
}
