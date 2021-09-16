const dotenv = require('dotenv');
dotenv.config();

if (process.env.MAGISTER_CALENDAR_CONFIG) {
    if (!process.env.GOOGLE_CREDENTIALS) {
        throw new Error('Found config enviroment variable, but the credentials variable is missing. Set ' +
            'the variable `GOOGLE_CREDENTIALS` to a JSON encoded string of your credentials file. See ' +
            'https://github.com/robincunningham2/MagisterCalendar/tree/master/docs/en-US for more info.');
    }

    module.exports = {
        ...process.env.MAGISTER_CALENDAR_CONFIG,
        credentials: process.env.GOOGLE_CREDENTIALS,
    };
} else {
    module.exports = {
        ...require('./config'),
        credentials: require('./credentials.json'),
    };
}
