const express = require('express');
const app = express();

app.get('/', (_, res) => {
    res.send('Hello world!');
});

app.use('/api/v1', require('./api/v1'));

app.use('/api', (_, res) => {
    res.status(404).json({
        status: 404,
        message: 'The requested page was not found.'
    });
});

app.listen(3000, () => {
    console.log('Webserver has been started');
});
