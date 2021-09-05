const Config = require('../config/index');
const { google } = require('googleapis');

class GoogleCalendar {
    constructor() {
        this.scopes = Config.googleApis.scopes;
        this.client = null;
        this.calendar = null;
    }

    _generateEventOptions(appointment) {
        return {
            auth: this.client,
            calendarId: Config.googleApis.calendarId,
            resource: {
                summary: Config.appointments.summary(appointment),
                location: appointment.Lokatie || Config.appointments.defaults.location,
                description: appointment.Inhoud || Config.appointments.defaults.description,
                colorId: Config.appointments.color(appointment),
                start: {
                    dateTime: new Date(Number(new Date(appointment.Start)) + 7_200_000).toISOString().slice(0, -5),
                    timeZone: Config.googleApis.timeZone
                },
                end: {
                    dateTime: new Date(Number(new Date(appointment.Einde)) + 7_200_000).toISOString().slice(0, -5),
                    timeZone: Config.googleApis.timeZone
                },
                reminders: Config.appointments.reminders
            }
        };
    }

    async authorize(callback, token = null) {
        this.client = new google.auth.OAuth2(
            Config.credentials.installed.client_id,
            Config.credentials.installed.client_secret,
            Config.credentials.installed.redirect_uris[0]
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
