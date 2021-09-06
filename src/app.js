const Config = require('../config/index');

const readline = require('readline');
const fs = require('fs');

const { Magister } = require('./magister');
const { GoogleCalendar } = require('./calendar');

const calendar = new GoogleCalendar(Config);
const client = new Magister(Config.magister);

function callback(url) {
    console.log(`Authenticate via this URl: ${url}`);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question('Enter the code from the page: ', (code) => {
            rl.close();
            resolve(code);
        });
    });
}

let token;
if (fs.existsSync('.tmp/token.json')) token = require('../.tmp/token.json');

Promise.all([
    calendar.authorize(callback, token),
    client.login(),
]).then(async (result) => {
    token = result[0].token;
    fs.writeFileSync('.tmp/token.json', JSON.stringify(token));

    const appointments = (await client.get(`/personen/${client.me.Id}/afspraken`)).Items;

    for (let i = 0; i < appointments.length; i++) {
        await calendar.createEvent(appointments[i]);
    }
});
