const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const expressHandlebars = require('express-handlebars');
const { createPagination } = require('express-handlebars-paginate');
const bodyParser = require('body-parser');
 
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

// Cấu hình body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', require('./routes/dasdboardRouter'));
app.use('/project', require('./routes/projectRouter'));
// app.use('/requirement', require('./routes/requirementRouter'));
// app.use('/release', require('./routes/releaseRouter'));
// app.use('/module', require('./routes/moduleRouter'));
// app.use('/test-case', require('./routes/testCaseRouter'));
// app.use('/test-run', require('./routes/testRunRouter'));
// app.use('/test-plan', require('./routes/testPlanRouter'));
// app.use('/issue', require('./routes/issueRouter'));
// app.use('/report', require('./routes/reportRouter'));
app.use('/administration', require('./routes/administrationRouter'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})
