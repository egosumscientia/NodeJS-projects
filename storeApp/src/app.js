import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './Routes/userRoutes.js';
import productRoutes from './Routes/productRoutes.js';
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({origin:true}));
//routes
app.use(userRoutes);
app.use(productRoutes);
app.use(companyRoutes);

app.listen(port,async()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/StoreDB');
    }catch{
        console.log("Error de conexión a la BD");
    }
    console.log(`This is our store listening at http://localhost:${port}`);
})
