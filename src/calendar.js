const Config = require('../config/index');
const { google } = require('googleapis');

class GoogleCalendar {
    constructor() {
        this.scopes = Config.googleapis.scopes;
        this.client = null;
        this.calendar = null;
    }

    _generateEventOptions(appointment) {
        return {
            auth: this.client,
            calendarId: Config.googleapis.defaultCalendar,
            resource: {
                summary: `${appointment.Vakken[0].Naam} - ${appointment.Docenten[0].Docentcode}`,
                location: appointment.Lokatie,
                description: appointment.Inhoud || '<i>Geen inhoud</i>',
                // colorId: color || 7,
                start: {
                    dateTime: new Date(Number(new Date(appointment.Start)) + 7_200_000).toISOString().slice(0, -5),
                    timeZone: Config.googleapis.timeZone
                },
                end: {
                    dateTime: new Date(Number(new Date(appointment.Einde)) + 7_200_000).toISOString().slice(0, -5),
                    timeZone: Config.googleapis.timeZone
                },
                reminders: {
                    useDefault: false
                }
            }
        };
    }

    async authorize(callback, token = null) {
        const creds = require('../config/credentials.json');
        this.client = new google.auth.OAuth2(
            creds.installed.client_id,
            creds.installed.client_secret,
            creds.installed.redirect_uris[0]
        );

        if (!token) {
            const url = this.client.generateAuthUrl({
                access_type: 'offline',
                scope: this.scopes,
            });

            await new Promise((resolve, reject) => {
                callback(url).then(code => {
                    this.client.getToken(code, (err, tok) => {
                        if (err) return reject(err);
                        this.client.setCredentials(tok);

                        token = tok;
                        resolve(this);
                    });
                });
            });
        } else {
            this.client.setCredentials(token);
        }

        this.calendar = google.calendar({ version: 'v3', auth: this.client });
        return { authorized: true, token };
    };

    createEvent(appointment) {
        const options = this._generateEventOptions(appointment);
        return this.calendar.events.insert(options);
    }
}

module.exports = { GoogleCalendar };
