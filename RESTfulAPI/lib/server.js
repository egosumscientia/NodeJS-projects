//Server related tasks

//Dependencies
let http = require('http');
let https = require('https');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
let config = require('./config');
let fs = require('fs');
let handlers = require('./handlers');
let helpers = require('./helpers');
let path = require('path');
let util = require('util');
let debug = util.debuglog('server');

//Instantiate the server module object
let server = {};

//twilio
/* helpers.sendTwilioSms('4158375309','Hello there!',function(err){
    console.log('this was the error',err);
}); */

//Instantiate the HTTP server
server.httpServer = http.createServer(function(req,res){
    server.unifiedServer(req, res);
});

//Instantiate HTTPS server
server.httpsServerOptions = {
    'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, function(req,res){
    server.unifiedServer(req,res);
});

//All the server logic for both http and https server
server.unifiedServer = function(req, res){
    //Get te URL and parse it
    const parsedUrl = url.parse(req.url, true);

    //Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'')

    //Get the query string as an object
    const queryStringObject = parsedUrl.query;

    //Get the HTTP method
    const method = req.method.toLowerCase();

    //Get the headers as an object
    const headers = req.headers;

    //Get the payload, if any. add stringDecoder library
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    
    req.on('data', function(data){
        buffer += decoder.write(data)
    });

    req.on('end', function(){
        buffer += decoder.end();

    //Choose the handler this request should go to. if not found, use the 'not found' handler provided
    let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

    //Construct the data object (JSON) to send it to the handler
    let data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : helpers.parseJsonToObject(buffer) 
    };

    //Route the request to the handler specified in the handler
    chosenHandler(data, function(statusCode, payload){
            //Use the satus code called back by the handler or default (200)
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //Use the payload called back by the handler or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            //Convert the payload to a string. This is the payload the handler is sending back to the user
            let payloadString = JSON.stringify(payload);

            //Return the response
            res.setHeader('Content-Type','application/json'); //We are sending JSON. This lets know every one out there wI am sending JSON format.
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('Returning this response: ', statusCode, payloadString);
            
            //if the response is 200 print green, otherwise print red
            /* if(statusCode==200){
                debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            }else{
                debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            } */
        });
    });
};

//Define a request router
server.router = {
    'ping' : handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks
};

//Init script
server.init = function(){
    //Start the HTTP server
    server.httpServer.listen(config.httpPort,function(){
        console.log('\x1b[36m%s\x1b[0m',"The server is listening on port " + config.httpPort  + " in " + config.envName + " mode");
    });
    //Start the HTTPS server
    server.httpsServer.listen(config.httpsPort,function(){
        console.log('\x1b[35m%s\x1b[0m',"The server is listening on port " + config.httpsPort  + " in " + config.envName + " mode");

    });
};

//Export the whole server
module.exports = server;