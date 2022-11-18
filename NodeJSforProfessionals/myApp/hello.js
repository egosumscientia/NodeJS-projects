//import the top-level function of express
const { response } = require('express');
const express = require('express');
//Creates an express application using the top-level function
const app = express();
//Define port number as 3000
const port = 3000;
//Routes HTTP GET requests to the specified path "/" with the specified callback function
app.get('/', function(request,response){
    response.send('Hello World!');
});
//Make the app listen to port 3000
app.listen(port,function(){
    console.log('Server listening to http://localhost: ' + port);
});

