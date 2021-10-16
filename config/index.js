const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

if (!process.env.MAGISTER_CALENDAR_CONFIG) {
    let config;
    const dir = __dirname.split('/').filter((x) => !!x.length);
    for (let i = 0; i < dir.length; i++) {
        if (fs.existsSync(`/${dir.slice(0, i).join('/')}/.magistercalendarrc.js`)) {
            config = require(`/${dir.slice(0, i).join('/')}/.magistercalendarrc.js`);
        } else if (fs.existsSync(`/${dir.slice(0, i).join('/')}/.magistercalendarrc.json`)) {
            config = require(`/${dir.slice(0, i).join('/')}/.magistercalendarrc.json`);

            config.functions.filter = eval(config.functions.filter.$function);
            config.functions.summary = eval(config.functions.summary.$function);
            config.functions.color = eval(config.functions.color.$function);
        }
    }

    if (!config) throw new Error('No config file found. Run `npm run init` to create a config file');

    module.exports = {
        ...config,
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    };
} else {
    if (!process.env.GOOGLE_CREDENTIALS) {
        throw new Error('Found config enviroment variable, but the credentials variable is missing. Set ' +
            'the variable `GOOGLE_CREDENTIALS` to a JSON encoded string of your credentials file. See ' +
            'https://github.com/robincunningham2/MagisterCalendar/tree/master/docs/en-US for more info.');
    }

    module.exports = {
        ...eval(process.env.MAGISTER_CALENDAR_CONFIG),
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    };
}
