const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    googleapis: {
        timeZone: process.env.TZ || 'Europe/Amsterdam',
        scopes: (
            process.env.SCOPES ||
            'https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/calendar.events'
        ).split(',')
    }
}
