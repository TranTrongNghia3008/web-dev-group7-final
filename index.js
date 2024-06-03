const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const expressHandlebars = require('express-handlebars');
const { createPagination } = require('express-handlebars-paginate');
 
app.use(express.static(__dirname + "/public"));


app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {allowProtoPropertiesByDefault: true},
    helpers: {
        createPagination
    }
}));

app.set('view engine', 'hbs');

app.use('/', require('./routes/dasdboardRouter'));
app.use('/project', require('./routes/projectRouter'));
app.use('/requirement', require('./routes/requirementRouter'));
app.use('/release', require('./routes/releaseRouter'));
app.use('/module', require('./routes/moduleRouter'));
app.use('/test-case', require('./routes/testCaseRouter'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})
