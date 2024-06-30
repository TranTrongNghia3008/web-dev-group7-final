const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const expressHandlebars = require('express-handlebars');
const { createPagination } = require('express-handlebars-paginate');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./controllers/passport');
const { ensureAuthenticated } = require('./middlewares/auth');
 
app.use(express.static(__dirname + "/public"));

const mongoose = require('mongoose');
const connectDB = require('./connectDB');
connectDB();


app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {allowProtoPropertiesByDefault: true},
    helpers: {
        createPagination,
        formatDate: function (date) {
            return new Date(date).toISOString().split('T')[0];
        },
        formatDate2: function (date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return new Date(date).toLocaleDateString('en-US', options);
        },
        formatDate3: function (date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric'};
            return new Date(date).toLocaleDateString('en-US', options);
        },

        formatTime: function (date) {
            return new Date(date).toISOString().split('T')[1].split('.')[0];
        },

        truncateId: function (id, limit) {
            const strId = String(id);
            if (limit === 0 || limit >= strId.length) {
                return strId;
            } else {
                const halfLimit = Math.floor(limit / 2);
                const firstPart = strId.substring(0, halfLimit);
                const secondPart = strId.substring(strId.length - halfLimit);
                return firstPart + "..." + secondPart;
            }
        },
        getInitials: function (name) {
            const nameParts = name.trim().split(' ');
            const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
            return initials.substring(0, 2);
        },
        eq: (a, b) => a === b,
    }
}));

app.set('view engine', 'hbs');

// Cấu hình session
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true
}));

// Cấu hình flash
app.use(flash());

// Cấu hình body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.error_msg = req.flash('error_msg');
    res.locals.success_msg = req.flash('success_msg');
    next();
});

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      res.redirect("/login");
    }
  });
app.use('/login', require('./routes/loginRouter'));
app.use('/register', require('./routes/registerRouter'));
app.use('/logout', require('./routes/logoutRouter'));
app.use('/dashboard', ensureAuthenticated, require('./routes/dasdboardRouter'));
app.use('/project', ensureAuthenticated, require('./routes/projectRouter'));
app.use('/administration', ensureAuthenticated, require('./routes/administrationRouter'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})
