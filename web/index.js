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
    res.render('pages/index', { language: require('./languages/nl-NL').index });
});

app.get('/signup', (req, res) => {
    if (!req.session.tokenFile) return res.redirect(302, '/api/v1/generateAuthUrl');
    res.render('pages/signup', { token: JSON.stringify(req.session.tokenFile) });
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
    res.status(404).render('errors/404');
});

app.listen(3000, () => {
    console.log('Webserver has been started');
});
