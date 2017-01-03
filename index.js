// main starting point of the application
const express = require('express');
const http = require('http'); // <- native node library
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

const app = express();
// ^ an instance of express


// DB Setup
// --------
mongoose.connect('mongodb://localhost:auth/auth')


// App Setup
// ---------
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}))
// ^ morgan and bodyParser are express middleware, app.use registers as middleware
// 'morgan' is for logging incoming requests to server in console
// 'bodyParser' is for parsing incoming requests.
// will attempt to parse into JSON any incoming request

router(app);

// Server Setup
// ------------
// before adding a script to use nodemon would run server by 'node index.js' command
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('server listening on: ', port)
