/* Import node's http module: */
var http = require('http');
var handleRequest = require('./request-handler');
var express = require('express')
var path = require('path')



var app = express();

// app.use(express.static(__dirname + '/public'));

app.use(express.static('public'))

app.get('/classes/messages', function (req, res) {
  handleRequest.requestHandler(req, res);
})

app.post('/classes/messages', function(req, res) {
  handleRequest.requestHandler(req, res);
});

// app.use('/public' , express.static(path.join(__dirname  + 'index.html' )));

// app.use('/public' , express.static(path.join(__dirname  + 'styles.css' )));


app.get('/', function(req, res) {


    // res.sendFile(path.join(__dirname + '/../client/index.html'));
    // res.sendFile(path.join(__dirname + '/../client/index.html'));
});


    // res.sendFile(path.join(__dirname + '/../client/index.html'));
    //res.sendFile(path.join(__dirname + '/public/index.html'));


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
// // Every server needs to listen on a port with a unique number. The
// // standard port for HTTP servers is port 80, but that port is
// // normally already claimed by another server and/or not accessible
// // so we'll use a standard testing port like 3000, other common development
// // ports are 8080 and 1337.
// var port = 3000;

// // For now, since you're running this server on your local machine,
// // we'll have it listen on the IP address 127.0.0.1, which is a
// // special address that always refers to localhost.
// var ip = '127.0.0.1';



// // We use node's http module to create a server.
// //
// // The function we pass to http.createServer will be used to handle all
// // incoming requests.
// //
// // After creating the server, we will tell it to listen on the given port and IP. */
// var server = http.createServer(handleRequest.requestHandler);
// console.log('Listening on http://' + ip + ':' + port);
// server.listen(port, ip);

// // To start this server, run:
// //
// //   node basic-server.js
// //
// // on the command line.
// //
// // To connect to the server, load http://127.0.0.1:3000 in your web
// // browser.
// //
// // server.listen() will continue running as long as there is the
// // possibility of serving more requests. To stop your server, hit
// // Ctrl-C on the command line.

