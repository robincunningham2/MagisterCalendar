// A more readable, better (, and possibly faster) version of https://www.npmjs.com/package/magister.

const got = require('got').default;
const url = require('url');
const { CookieJar } = require('tough-cookie');

class MagisterError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'MagisterError';
        this.code = code;
    }
}

class Magister {
    constructor(options) {
        this._cookieJar = null;
        this._sessionId = null;
        this._accessToken = null;

        this.user = String(options.userId);
        this.password = options.password;
        this.hostname = `${options.schoolId}.magister.net`;

        this.me = null;
    }

    _generateUrl(base, params = {}) {
        const items = [];
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                items.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
            }
        }

        return items.length > 0 ? `${base}?${items.join('&')}` : base;
    }

    _generateQuery() {
        return {
            client_id: `M6-${this.hostname}`,
            redirect_uri: `https://${this.hostname}/oidc/redirect_callback.html`,
            response_type: 'id_token token',
            scope: 'openid profile',
            acr_values: `tenant:${this.hostname}`,
            state: '0'.repeat(32),
            nonce: '0'.repeat(32),
        };
    }

    async _submitChallenge(name, optionalData = {}) {
        try {
            const jar = this._cookieJar.toJSON();
            const json = await got.post(`https://accounts.magister.net/challenges/${name}`, {
                cookieJar: this._cookieJar,
                headers: {
                    'Content-Type': 'application/json',
                    'x-xsrf-token': jar.cookies.find((cookie) => cookie.key === 'XSRF-TOKEN').value,
                },
                throwHttpErrors: false,
                json: Object.assign({
                    sessionId: this._sessionId,
                    returnUrl: this._generateUrl('/connect/authorize/callback', this._generateQuery()),
                }, optionalData),
            }).json();

            return json;
        } catch (error) {
            return {
                redirectURL: null,
                tenantname: null,
                username: null,
                useremail: null,
                error,
            };
        }
    }

    async _initCookies() {
        this._cookieJar = new CookieJar();

        const response = await got(
            this._generateUrl('https://accounts.magister.net/connect/authorize', this._generateQuery()),
            { cookieJar: this._cookieJar },
        );

        this._sessionId = String(url.parse(response.url, true).query.sessionId);
    }

    async get(path) {
        if (!this._accessToken) throw new MagisterError('Not logged into magister. Try client.login() first', '02');
        return await got(`https://${this.hostname}/api${path}`, {
            cookieJar: this._cookieJar,
            headers: { authorization: `Bearer ${this._accessToken}` },
        }).json();
    }

    async post(path, data={}) {
        if (!this._accessToken) throw new MagisterError('Not logged into magister. Try client.login() first', '02');
        return await got.post(`https://${this.hostname}/api${path}`, {
            cookieJar: this._cookieJar,
            headers: { authorization: `Bearer ${this._accessToken}` },
            json: data,
        }).json();
    }

    async put(path, data={}) {
        if (!this._accessToken) throw new MagisterError('Not logged into magister. Try client.login() first', '02');
        return await got.put(`https://${this.hostname}/api${path}`, {
            cookieJar: this._cookieJar,
            headers: { authorization: `Bearer ${this._accessToken}` },
            json: data,
        }).json();
    }

    async patch(path, data={}) {
        if (!this._accessToken) throw new MagisterError('Not logged into magister. Try client.login() first', '02');
        return await got.patch(`https://${this.hostname}/api${path}`, {
            cookieJar: this._cookieJar,
            headers: { authorization: `Bearer ${this._accessToken}` },
            json: data,
        }).json();
    }

    async delete(path, data={}) {
        if (!this._accessToken) throw new MagisterError('Not logged into magister. Try client.login() first', '02');
        return await got.delete(`https://${this.hostname}/api${path}`, {
            cookieJar: this._cookieJar,
            headers: { authorization: `Bearer ${this._accessToken}` },
            json: data,
        }).json();
    }

    async login() {
        await this._initCookies();

        await this._submitChallenge('current');
        await this._submitChallenge('username', { username: this.user });
        const response = await this._submitChallenge('password', { password: this.password });

        this.password = '';

        if (!response.redirectURL) {
            console.log(response.error);
            throw new MagisterError('No redirect URL received. Most likely the credentials are incorrect.', '01');
        }

        const redirectResponse = await got(`https://accounts.magister.net${response.redirectURL}`, {
            cookieJar: this._cookieJar,
            throwHttpErrors: false,
            followRedirect: false,
        });

        const { hash } = url.parse(redirectResponse.headers.location, true);

        this._accessToken = hash.split('&').reduce((acc, curr) => {
            const v = curr.split('=');
            acc[v[0]] = v[1];
            return acc;
        }, {}).access_token;

        const account = await this.get('/account?noCache=0');
        this.me = account.Persoon;
    }
}

module.exports = { Magister, MagisterError };
