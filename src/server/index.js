'use strict';

let path            = require('path'),
    express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    session         = require('express-session'),
    mongoose        = require('mongoose');

mongoose.Promise = global.Promise;
let port = process.env.PORT ? process.env.PORT : 8080;
let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

/**********************************************************************************************************/

// Setup our Express pipeline
let app = express();
app.use(express.static(path.join(__dirname, '../../public')));
if (env !== 'test') app.use(logger('dev'));
app.engine('pug', require('pug').__express);
app.set('views', __dirname);
// Setup pipeline session support
app.use(session({
    name: 'session',
    secret: 'ohhellyes',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false
    }
}));
// Finish pipeline setup
app.use(bodyParser.json());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// Connect to mongoBD
let options = {
    useMongoClient: true
};

mongoose.connect('mongodb://192.168.99.100:32776/broderbm', options)
    .then(() => {
        console.log('\t MongoDB connected');

        // Import our Data Models
        app.models = {
            Game: require('./models/game'),
            User: require('./models/user')
        };

        // Import our API Routes
        require('./api/v1/user')(app);
        require('./api/v1/session')(app);
        require('./api/v1/picture')(app);
        require('./api/v1/paymentHandle')(app);

        // Give them the SPA base page
        app.get('*', (req, res) => {
            res.render('base.pug', {});
        });
    }, err => {
        console.log(err);
    });

/**********************************************************************************************************/

// Run the server itself
let server = app.listen(port, () => {
    console.log('FacePay app listening on ' + server.address().port);
});
