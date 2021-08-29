const Config = require('../config/index');

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

class GoogleCalendar {
    constructor() {
        this.scopes = Config.googleapis.scopes;
        this.client = null;
        this.calendar = null;
    }

    _saveToken() {
        const url = this.client.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes,
        });

        console.log(`Authenticate via this URl: ${url}`);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise((resolve, reject) => {
            rl.question('Enter the code from the page: ', (code) => {
                rl.close();

                this.client.getToken(code, (err, token) => {
                    if (err) return reject(err);
                    this.client.setCredentials(token);

                    fs.writeFileSync('./.tmp/token.json', JSON.stringify(token));
                    resolve(this);
                });
            });
        });
    }

    async authorize() {
        const creds = require('../config/credentials.json');
        this.client = new google.auth.OAuth2(
            creds.installed.client_id,
            creds.installed.client_secret,
            creds.installed.redirect_uris[0]
        );

        if (!fs.existsSync('./.tmp/token.json')) await this._saveToken();
        else {
            const token = require('../.tmp/token.json');
            this.client.setCredentials(token);
        }

        this.calendar = google.calendar({ version: 'v3', auth: this.client });
        return this;
    };

    createEvent(options) {
        return this.calendar.events.insert({
            auth: this.client,
            calendarId: Config.googleapis.defaultCalendar,
            resource: {
                summary: options.summary,
                location: options.location,
                description: options.description,
                colorId: options.color || 7,
                start: {
                    dateTime: options.start,
                    timeZone: Config.googleapis.timeZone
                },
                end: {
                    dateTime: options.end,
                    timeZone: Config.googleapis.timeZone
                },
                reminders: {
                    useDefault: false
                }
            }
        });
    }
}

module.exports = { GoogleCalendar };
