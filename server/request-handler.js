var fs = require('fs');


// fs.readFile('data.json', (err, data) => {
//   if(err) throw err.message;
//   var f = data.toString().split('\n')
//   for (var i = 0; i < f.length-1; i++) {
//     console.log(typeof f[i])
//     console.log(f[i])
//     console.log(JSON.parse(f[i]));
//   };
//   console.log(`file has ${f.length -1} objects`)
// })


// fs.readFile('test.json', (err, data) => {
//   if(err) throw err.message;
//   myFile = data;
//   // console.log(data.toString())
// })



// fs.writeFile('test.json', 'hello Node.js', (err) => {
//   if (err) throw err;
//   console.log('is saved')
// })




var requestHandler = function(request, response) {

  // console.log('MYFILES IS: ', myFile)
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.log('REQUEST IS: ', request)  
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // console.log('DATA IS: ', request.data)
  handleEndpoints(request.method, request.url);
  function handleEndpoints (method, url){
    if ( url === '/classes/messages' ){
      if (method === "GET"){

        // composeResponse(response);
        var statusCode = 200;
        var headers = defaultCorsHeaders;
        headers['Content-Type'] = 'text/plain';
        response.writeHead(statusCode, headers);
        // response.end('Hello Welcome To The Quickie Market');
        var data = { results: [1,2,3,4,5] }
        response.end(JSON.stringify(data))
      } else if (method === "POST") {
        request.on('data', function(data){
          // console.log("DATAS IS: ",JSON.parse(data))
            // var D;
            // fs.readFile('data.json', (err, prevData) => {
            //   if(err) throw err.message;
            //   D = prevdata
            // })
            // fs.writeFile('data.json', data, (err) => {
            //     if (err) throw err;
            //     console.log('is saved')
            //  })
            fs.appendFile('data.json', data + '\n', function(err){
              if (err) throw err.message;
              console.log('appended: ', data)
              var statusCode = 201;
              var headers = defaultCorsHeaders;
              headers['Content-Type'] = 'text/plain';
              response.writeHead(statusCode, headers);

              response.end('OKAY BRO')
            })
        })


      }
    } else {
      //return a 404
      var statusCode = 404;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      response.end('error')
    }

  }

  // The outgoing status.
  // var statusCode = 200;

  // // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // // Tell the client we are sending them plain text.
  // //
  // // You will need to change this if you are sending something
  // // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // // .writeHead() writes to the request line and headers of the response,
  // // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // // Make sure to always call response.end() - Node may not send
  // // anything back to the client until you do. The string you pass to
  // // response.end() will be the body of the response - i.e. what shows
  // // up in the browser.
  // //
  // // Calling .end "flushes" the response's internal buffer, forcing
  // // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};

// function composeResponse(response, status, data){
//   var finalResult;
//   //dosomething with someting
//   return JSON.stringify(finalResult)
// }

// function endPointPOST(method, url, response){
//   var finalResult;
//   //dosomething with someting
//   return JSON.stringify(finalResult)
// }

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};




module.exports.requestHandler = requestHandler;
