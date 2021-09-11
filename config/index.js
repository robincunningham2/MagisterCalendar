const dotenv = require('dotenv');
dotenv.config();

if (process.env.MAGISTER_CALENDAR) module.exports = JSON.parse(process.env.MAGISTER_CALENDAR);
else {
    const config = require('./config');
    const credentials = require('./credentials.json');

    module.exports = {
        ...config,
        credentials,
    };
}
