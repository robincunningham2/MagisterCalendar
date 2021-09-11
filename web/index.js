const express = require('express');
const app = express();

app.get('/', (_, res) => {
    res.send('Hello world!');
});

app.listen(3000, () => {
    console.log('Webserver has been started');
});
