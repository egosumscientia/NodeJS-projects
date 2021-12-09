/* This is the primary file for the API */

//Dependencies
let http = require('http');
let https = require('https');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
//const {StringDecoder} = require('string_decoder');
let config = require('./lib/config');
let fs = require('fs');
let handlers = require('./lib/handlers');
let helpers = require('./lib/helpers');
/* let _data = require('./lib/data'); */

//TESTING
//@TODO delete this
/* _data.create('test','newFile',{'foo':'bar'},function(err){
    console.log('this was the error: ',err);
});

_data.update('test','newFile',{'PauloEnrique':'GANADOR'},function(err){
    console.log('this was the error: ',err);
});

_data.delete('test','newFile',function(err){
    console.log('this was the error: ',err);
}); */


//Instantiate the HTTP server
let httpServer = http.createServer(function(req,res){
    unifiedServer(req, res);
});

//Start the HTTP server
httpServer.listen(config.httpPort,function(){
    console.log("The server is listening on port " + config.httpPort  + " in " + config.envName + " mode");
});

//Instantiate HTTPS server
let httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

let httpsServer = https.createServer(httpsServerOptions, function(req,res){
    unifiedServer(req,res);
});

//Start the HTTPS server
httpsServer.listen(config.httpsPort,function(){
    console.log("The server is listening on port " + config.httpsPort  + " in " + config.envName + " mode");
});

//All the server logic for both http and https server
let unifiedServer = function(req, res){
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
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

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

        //Log the request path
        /* console.log('Request is received on this path: '+ trimmedPath + ' with this method: ' + method + ' and with these query string parameters: ', queryStringObject); */
        /* console.log('Request received with these headers: ', headers) */
        //console.log('Request received with this payload: ', buffer)

        console.log('Returning this response: ', statusCode, payloadString);

        });

    });
};


//Define a request router
let router = {
    'ping' : handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens
};