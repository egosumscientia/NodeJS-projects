import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/UserRoutes.js';
const app = express();
const port =  process.env.PORT || 3001;
const TestDB = 'mongodb://localhost:27017/TestDB';
const mongoAtlasURL = 'mongodb+srv://depth81:paulo_cuenta2@cluster0.rrk1j.mongodb.net/pejelagartoDB?retryWrites=true&w=majority';

app.use(express.json());
app.use(cors({ origin: true }));
// routes
app.use(userRoutes);

app.listen(port, async () => {
  try {
    await mongoose.connect(TestDB,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
  catch (e) {
    console.log("Error de conexión a la DB");
  }
  console.log(`Example app listening at http://localhost:${port}`);
})