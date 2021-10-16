const { google } = require('googleapis');
const got = require('got').default;

class OAuth2 {
    constructor(options, token = null) {
        this.options = options;
        this.token = token;
        this.auth = null;
    }

    async authorize() {
        this.auth = new google.auth.OAuth2(
            this.options.client_id,
            this.options.client_secret,
            this.options.redirect_uri,
        );

        if (!this.token) {
            const url = this.auth.generateAuthUrl({
                access_type: 'offline',
                scope: this.options.scopes,
            });

            if (!this.options.code) {
                await new Promise((resolve, reject) => {
                    this.options.callback(url).then((code) => {
                        this.auth.getToken(code, (err, t) => {
                            if (err) return reject(err);
                            this.token = t;
                            resolve();
                        });
                    });
                });
            }
        } else if (new Date > this.token.expiry_date - 1000) {
            const now = Number(new Date);
            const response = await got.post('https://www.googleapis.com/oauth2/v4/token', {
                json: {
                    client_id: this.options.client_id,
                    client_secret: this.options.client_secret,
                    refresh_token: this.token.refresh_token,
                    grant_type: 'refresh_token',
                },
            }).json();

            this.token.access_token = response.access_token;
            this.token.expiry_date = now + response.expires_in * 1000;
        }

        this.auth.setCredentials(this.token);
        return this;
    }
}

OAuth2.generateAuthUrl = (options) => {
    const auth = new google.auth.OAuth2(
        options.client_id,
        options.client_secret,
        options.redirect_uri,
    );

    return auth.generateAuthUrl({
        access_type: 'offline',
        scope: options.scopes,
    });
};

OAuth2.generateTokenFile = (options, code) => {
    const auth = new google.auth.OAuth2(
        options.client_id,
        options.client_secret,
        options.redirect_uri,
    );

    return new Promise((resolve, reject) => {
        auth.getToken(code, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
};

class GoogleCalendar {
    constructor(config, callback, web = false, token = null) {
        this._config = config;

        this._auth = null;
        this._calendar = null;

        this._options = {
            callback,
            web,
            token,
        };

        this._token = this._options.token;
    }

    async authorize() {
        const creds = this._options.web ? this._config.credentials.web : this._config.credentials.installed;

        let oauth;
        if (this._token instanceof OAuth2) oauth = this._token;
        else {
            oauth = new OAuth2({
                client_id: creds.client_id,
                client_secret: creds.client_secret,
                redirect_uri: creds.redirect_uris[0],
                scopes: this._config.scopes,
                callback: this._options.callback,
            }, this._token);
        }

        await oauth.authorize();
        this._auth = oauth.auth;
        this._token = oauth.token;

        this._calendar = google.calendar({ version: 'v3', auth: this._auth });
        return this._token;
    }

    _generateEventOptions(appointment) {
        return {
            auth: this._auth,
            calendarId: this._config.settings.calendar,
            resource: {
                summary: this._config.functions.summary(appointment),
                location: appointment.Lokatie || this._config.settings.defaultLocationName,
                description: `<!--magisterId:${appointment.Id}-->` +
                    (appointment.Inhoud || this._config.settings.defaultDescription)
                        .split('<br>').join('\n'),
                colorId: this._config.functions.color(appointment),
                start: {
                    dateTime: new Date(appointment.Start).toISOString(),
                    timeZone: this._config.settings.timeZone,
                },
                end: {
                    dateTime: new Date(appointment.Einde).toISOString(),
                    timeZone: this._config.settings.timeZone,
                },
                reminders: this._config.settings.reminders,
            },
        };
    }

    async createEvent(appointment) {
        if (!this._config.functions.filter(appointment)) return this;

        const options = this._generateEventOptions(appointment);
        await this._calendar.events.insert(options);

        return this;
    }

    async updateEvent(appointment, eventData, deleteOnReject = false) {
        if (!this._config.functions.filter(appointment)) {
            if (deleteOnReject) return await this.deleteEvent(eventData.id);
            return this;
        }

        const options = this._generateEventOptions(appointment);
        options.resource.colorId = eventData.colorId;
        options.resource.reminders = eventData.reminders || { useDefault: false };

        await this._calendar.events.update({
            eventId: eventData.id,
            ...options,
        });

        return this;
    }

    async deleteEvent(eventId) {
        await this._calendar.events.delete({
            calendarId: this._config.settings.calendar,
            eventId,
        });

        return this;
    }

    async listEvents(from, to) {
        const res = await this._calendar.events.list({
            calendarId: this._config.settings.calendar,
            maxResults: 250,
            timeMin: from.toISOString(),
            timeMax: to.toISOString(),
        });

        return res.data.items || [];
    }
}

class GooglePeople {
    constructor(config, callback, web = false, token = null) {
        this._config = config;

        this._auth = null;
        this._people = null;

        this._options = {
            callback,
            web,
            token,
        };

        this._token = this._options.token;
    }

    async authorize() {
        const creds = this._options.web ? this._config.credentials.web : this._config.credentials.installed;

        let oauth;
        if (this._token instanceof OAuth2) oauth = this._token;
        else {
            oauth = new OAuth2({
                client_id: creds.client_id,
                client_secret: creds.client_secret,
                redirect_uri: creds.redirect_uris[0],
                scopes: this._config.scopes,
                callback: this._options.callback,
            }, this._token);
        }

        await oauth.authorize();
        this._auth = oauth.auth;
        this._token = oauth.token;

        this._people = google.people({ version: 'v1', auth: this._auth });
        return this._token;
    }

    async me() {
        const res = await this._people.people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses',
        });

        return res.data;
    }
}

function DESKTOP_CALLBACK(url) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        console.log(`Authenticate via this URl: ${url}`);
        rl.question('Enter the code from the page: ', (code) => {
            rl.close();
            resolve(code);
        });
    });
}

module.exports = {
    OAuth2,
    GoogleCalendar,
    GooglePeople,
    defaults: {
        DESKTOP_CALLBACK,
    },
};
