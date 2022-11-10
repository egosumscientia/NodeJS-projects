require('dotenv').config();
//async errors
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');

const notFoundMiddleware = require('./middleware/not-found');
const errorMidlleware = require('./middleware/error-handler');

//middleware
app.use(express.json());

//routes
app.get('/',(req, res)=>{
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use('/api/v1/products',productsRouter)

//products route

app.use(notFoundMiddleware);
app.use(errorMidlleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try{
        //connectDB
        await connectDB(process.env.MONGO_URI);
        app.listen(port,console.log(`the server is listening to the port: ${port}`));
    }catch(error){
        console.log(error);
    }
}

start();