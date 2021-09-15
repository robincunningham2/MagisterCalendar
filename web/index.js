const express = require('express');
const cookieSession = require('cookie-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'web/views');

app.use(cookieSession({ secret: require('crypto').randomBytes(16).toString('base64') }));

app.use('/static/assets', express.static('web/assets'));
app.use('/static/css', express.static('web/css'));
app.use('/static/js', express.static('web/js'));

app.get('/', (_, res) => {
    res.end('Index page');
});

app.use('/api/v1', require('./api/v1'));

app.use('/api', (_, res) => {
    res.status(404).json({
        status: 404,
        message: 'The requested URL was not found.',
    });
});

app.use('/', (req, res, next) => {
    if (req.url.startsWith('/static')) return next();
    // res.status(404).render('errors/404');
    res.end('404 not found');
});

app.listen(3000, () => {
    console.log('Webserver has been started');
});
