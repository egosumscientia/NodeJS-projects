import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './Routes/userRoutes.js';
import productRoutes from './Routes/productRoutes.js';
const app = express();
const port = 3000;
const uri = 'mongodb://localhost:27017/StoreDB';
const db = mongoose;

app.use(express.json());
app.use(cors({origin:true}));
//routes
app.use(userRoutes);
app.use(productRoutes);
app.use(companyRoutes);

app.listen(port,async()=>{
    try{
        await db.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db.connection.on('open',()=>{
            console.log("The DB is connected to: ", uri);
        });
    }catch{
        console.log("Error de conexión a la BD");
    }
    console.log(`This is our store listening at http://localhost:${port}`);
})
