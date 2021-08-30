/* This is the primary file for the API */

//Dependencies
const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder');

//The server should respond to all requests with a string
const server = http.createServer(function(req,res){
    

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
            'TrimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer 
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

});


//Start the server, and have it listening on port 3000
server.listen(3000,function(){
    console.log("The server is listening on port 3000...");
});

let handlers = {};

//'Sample' handler. Handlers send an object back to the user.
handlers.sample = function(data, callback){
    //Callback a http status code and a payload (object)
    callback(406, {'name' : 'I am a sample handler'})
};

//Not found a handler
handlers.notFound = function(data, callback){
    callback(404)
};

//Define a request router
let router = {

    'sample' : handlers.sample

}