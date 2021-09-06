const { google } = require('googleapis');
const got = require('got').default;

class GoogleCalendar {
    constructor(config) {
        this.config = config;

        this.scopes = this.config.googleApis.scopes;
        this.client = null;
        this.calendar = null;
    }

    async _generateAccessToken(token) {
        const response = await got.post('https://www.googleapis.com/oauth2/v4/token', {
            json: {
                client_id: this.config.credentials.installed.client_id,
                client_secret: this.config.credentials.installed.client_secret,
                refresh_token: token.refresh_token,
                grant_type: 'refresh_token',
            },
        }).json();

        token.access_token = response.access_token;
        token.expiry_date = Number(new Date) + response.expires_in * 1000;

        return token;
    }

    _generateEventOptions(appointment) {
        return {
            auth: this.client,
            calendarId: this.config.googleApis.calendarId,
            resource: {
                summary: this.config.appointments.summary(appointment),
                location: appointment.Lokatie || this.config.appointments.defaults.location,
                description: appointment.Inhoud || this.config.appointments.defaults.description,
                colorId: this.config.appointments.color(appointment),
                start: {
                    dateTime: new Date(Number(new Date(appointment.Start)) + 7_200_000).toISOString().slice(0, -5),
                    timeZone: this.config.googleApis.timeZone,
                },
                end: {
                    dateTime: new Date(Number(new Date(appointment.Einde)) + 7_200_000).toISOString().slice(0, -5),
                    timeZone: this.config.googleApis.timeZone,
                },
                reminders: this.config.appointments.reminders,
            },
        };
    }

    async authorize(callback, token = null) {
        this.client = new google.auth.OAuth2(
            this.config.credentials.installed.client_id,
            this.config.credentials.installed.client_secret,
            this.config.credentials.installed.redirect_uris[0],
        );

        if (!token) {
            const url = this.client.generateAuthUrl({
                access_type: 'offline',
                scope: this.scopes,
            });

            await new Promise((resolve, reject) => {
                callback(url).then((code) => {
                    this.client.getToken(code, (err, t) => {
                        if (err) return reject(err);
                        token = t;
                        resolve();
                    });
                });
            });
        } else if (new Date > token.expiry_date - 1000) {
            token = await this._generateAccessToken(token);
        }

        this.client.setCredentials(token);
        this.calendar = google.calendar({ version: 'v3', auth: this.client });

        return { authorized: true, token };
    }

    async createEvent(appointment) {
        if (!this.config.appointments.filter(appointment)) return this;

        const options = this._generateEventOptions(appointment);
        await this.calendar.events.insert(options);

        return this;
    }
}

module.exports = { GoogleCalendar };
