require('./server/config/config');

const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');

var {mongoose} = require('./server/db/mongoose');

const app = express();


// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
  secret: process.env.JWT_SECRET,
  getToken: function (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } /*else if (req.query && req.query.token) {
        return req.query.token;
    }*/
    return null;
  }
}).unless({ path: [
    '/users/login',
    '/users/register'
  ]
}));


// get api routes
const apiRoutes = require('./server/routes/api');
const userRoutes = require('./server/routes/user');


// Point static path to dist = server application, the only folder accessible from outside
app.use(express.static(path.join(__dirname, 'dist')));


// Set api routes, forwards any request to the routes
app.use('/users',userRoutes);
app.use('/', apiRoutes);


// Catch all other routes and return the index file, angular handles all errors
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


// Get port from environment and store in Express
// const port = process.env.NODE_ENV === 'production' ? 80 : config.port;
const port = process.env.NODE_ENV === 'production' ? 80 : process.env.NODE_PORT;


// const port = process.env.PORT || '3000';
app.set('port', port);


// Create HTTP server
const server = http.createServer(app);


// Listen on provided port, on all network interfaces
server.listen(port, () => console.log(`API running on localhost:${port}`));






