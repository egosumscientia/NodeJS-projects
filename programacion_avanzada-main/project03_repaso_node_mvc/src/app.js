import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/UserRoutes.js';
const app = express();
const port = 3000;

app.use(express.json())
app.use(cors({origin: true}))
// routes
app.use(userRoutes);


app.listen(port, async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
  catch (e) {
    console.log("Error de conexión a la DB")
  }
  console.log(`Example app listening at http://localhost:${port}`)
})
