require('cloud/app.js');

// To Do's:
// Get controllers working
// Modify routes/API
// Set get '/' to visit cloud/views/index.jade instead of public/index.html

// require('cloud/main')
// require('cloud/controllers/main')

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

// Renders cloud/views/index.jade
app.get('/hello', function(req, res) {
    res.render('index');
});

Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

// Attach the Express app to Cloud Code.
app.listen();