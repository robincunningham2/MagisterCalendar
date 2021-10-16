const config = require('../config/index');

const fs = require('fs');

const { Magister } = require('./magister');
const google = require('./googleServices');

let token = null;
if (fs.existsSync('.cache/token.json')) token = require('../.cache/token.json');

const magister = new Magister(config.settings.magister);
const auth = new google.OAuth2({
    client_id: config.credentials.installed.client_id,
    client_secret: config.credentials.installed.client_secret,
    redirect_uri: config.credentials.installed.redirect_uris[0],
    scopes: config.scopes,
    callback: google.defaults.DESKTOP_CALLBACK,
}, token);

const allowLogs = !process.argv.includes('--silent');

Promise.all([
    magister.login(),
    auth.auth,
]).then(async () => {
    const stats = { created: 0, updated: 0, removed: 0 };

    const calendar = new google.GoogleCalendar(config, google.defaults.DESKTOP_CALLBACK, auth);
    const people = new google.GooglePeople(config, google.defaults.DESKTOP_CALLBACK, auth);

    [token] = await Promise.all([ calendar.authorize(), people.authorize() ]);
    const me = await people.me();

    const now = new Date;

    if (allowLogs) {
        console.log(`Authorized at ${now}`);
        console.log(`Hello, ${me.names[0].displayName}`);
    }

    if (!fs.existsSync('.cache/')) fs.mkdirSync('.cache/');
    fs.writeFileSync('.cache/token.json', JSON.stringify(token));

    try {
        const items = await calendar.listEvents(
            new Date(new Date(Number(now) - 172_800_000).toISOString().split('T')[0]),
            new Date(new Date(Number(now) + (15 - now.getDay()) * 86_400_000).toISOString().split('T')[0]),
        );

        const existing = {};
        items.forEach((item) => {
            if (!item.description) return;
            item.description = String(item.description);

            const id = item.description.slice(
                item.description.indexOf('<!--magisterId:') + 15,
                item.description.indexOf('-->'),
            );

            if (id) existing[id] = item;
        });

        const from = new Date(Number(now) - 172_800_000).toISOString().split('T')[0];
        const to = new Date(Number(now) + (14 - now.getDay()) * 86_400_000).toISOString().split('T')[0];

        const res = await magister.get(`/personen/${magister.me.Id}/afspraken?tot=${to}&van=${from}`);
        for (let i = 0; i < res.Items.length; i++) {
            try {
                const item = res.Items[i];
                if (!existing[String(item.Id)]) {
                    await calendar.createEvent(item);
                    stats.created++;
                }
            } finally {}
        }

        for (const id in existing) {
            if (existing.hasOwnProperty(id)) {
                try {
                    const appointment = await magister.get(`/personen/${magister.me.Id}/afspraken/${id}`);
                    await calendar.updateEvent(appointment, existing[id], true);
                    stats.updated++;
                } catch {
                    try {
                        await calendar.deleteEvent(existing[id].id);
                        stats.removed++;
                    } finally {}
                }
            }
        }
    } catch(err) {
        console.error('\nError: ' + err.message);
        if (err.message == 'Insufficient Permission') {
            console.error('The application doesn\'t have the required permission, please delete the cache and rerun');
        }

        if (err.response) {
            filename = `magistercalendar-error-stack-${process.pid}.log`;
            fs.writeFileSync(filename, `${err.stack}\n\nResponse (${err.response.status} ${err.response.statusText}):\n` +
                JSON.stringify(err.response, null, 2) + '\n');
            console.error(`Saved error details to ${filename}`);
        }

        return false;
    }

    if (allowLogs) {
        console.log(`Created ${stats.created} events, edited ${stats.updated}, and removed ${stats.removed}`);
        console.log(`Finished in ${Math.round((Number(new Date) - Number(now)) / 100) / 10} s`);
    }
});
