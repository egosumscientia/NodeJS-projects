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

    //if the request is within the public directory, use the publid handler instead
    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

    //Construct the data object (JSON) to send it to the handler
    let data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : helpers.parseJsonToObject(buffer) 
    };

    //Route the request to the handler specified in the handler
    chosenHandler(data, function(statusCode, payload, contentType){

            //Determine the type of response (fallback to JSON)
            contentType = typeof(contentType) == 'string' && contentType ? contentType : 'json';

            //Use the satus code called back by the handler or default (200)
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //Return the response parts that are content-specific
            let payloadString = '';
            if(contentType == 'json'){
                res.setHeader('Content-Type','application/json');
                //Convert the payload to a string. This is the payload the handler is sending back to the user
                payload = typeof(payload) == 'object' ? payload : {};
                payloadString = JSON.stringify(payload);
            };
            if(contentType == 'html'){
                res.setHeader('Content-Type','text/html');
                payloadString = typeof(payload) == 'string' ? payload : '';
            };
            if(contentType == 'favicon'){
                res.setHeader('Content-Type','image/x-icon');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            };
            if(contentType == 'css'){
                res.setHeader('Content-Type','text/css');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            };
            if(contentType == 'png'){
                res.setHeader('Content-Type','image/png');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            };
            if(contentType == 'jpg'){
                res.setHeader('Content-Type','image/jpeg');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            };
            if(contentType == 'plain'){
                res.setHeader('Content-Type','text/plain');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            };

            //Return the response-parts that are common to all content-types
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
    '' : handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEditt,
    'account/deleted': handlers.accountDeleted,
    'session/create' : handlers.sessionCreate,
    'session/deleted' : handlers.sessionDeleted,
    'checks/all' : handlers.checkList,
    'checks/create' : handlers.checksCreate,
    'checks/edit' : handlers.checksEdit,
    'ping' : handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/checks': handlers.checks,
    'favicon.ico' : handlers.favicon,
    'public' : handlers.public
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