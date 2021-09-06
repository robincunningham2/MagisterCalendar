const dotenv = require('dotenv');
dotenv.config();

const config = require('./config');
const credentials = require('./credentials.json');

if (process.env.MAGISTER_CALENDAR) module.exports = JSON.parse(process.env.MAGISTER_CALENDAR);
else {
    module.exports = {
        ...config,
        credentials,
    };
}
