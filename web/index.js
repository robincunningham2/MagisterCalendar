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
    res.redirect('/lng/en-US/index');
});

app.get('/lng/:lng/index', (req, res, next) => {
    let lang;
    try {
        lang = require(`./languages/${req.params.lng.split('/').join('')}.json`);
    } catch {
        return next();
    }

    res.render('pages/index', { language: lang.index });
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
