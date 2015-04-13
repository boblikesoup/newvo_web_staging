require('cloud/api/app.js');
// require('cloud/views/controllers/controller.js')

// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var AppLinks = require('applinks-metatag');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'jade');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// Renders public/index.html
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/blog', function(req, res) {
    res.render('blog-index');
});

// Attach the Express app to Cloud Code.
app.listen();