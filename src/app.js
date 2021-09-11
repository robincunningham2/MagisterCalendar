const Config = require('../config/index');

const fs = require('fs');
const path = require('path');

const { Magister } = require('./magister');
const google = require('./googleServices');

let token = null;
if (fs.existsSync(path.join(process.cwd(), '.tmp/token.json'))) token = require('../.tmp/token.json');

const calendar = new google.GoogleCalendar(Config, google.defaults.DESKTOP_CALLBACK, token);
const magister = new Magister(Config.magister);

Promise.all([
    calendar.authorize(),
    magister.login(),
]).then(async (result) => {
    token = result[0];
    fs.writeFileSync(path.join(process.cwd(), '.tmp/token.json'), JSON.stringify(token));

    const items = await calendar.listEvents(
        new Date(Number(new Date) - 86_400_000).toISOString(),
        new Date(Number(new Date) + 604_800_000).toISOString()
    );

    let existingAppointments = {};
    items.forEach(item => {
        const id = ((item.description) || '').slice(
            ((item.description) || '').indexOf('<!--magisterId:') + 15,
            ((item.description) || '').indexOf('-->'),
        );

        if (id) existingAppointments[id] = item;
    });

    const res = await magister.get(`/personen/${magister.me.Id}/afspraken`);
    for (let i = 0; i < res.Items.length; i++) {
        const item = res.Items[i];
        if (!existingAppointments[String(item.Id)]) await calendar.createEvent(item);
    }

    for (const id in existingAppointments) {
        const appointment = await magister.get(`/personen/${magister.me.Id}/afspraken/${id}`);
        await calendar.updateEvent(appointment, existingAppointments[id]);
    }
});
