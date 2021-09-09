import express from 'express';
import mongoose from 'mongoose';
import companyRoutes from './routes/CompanyRoutes.js';
import userRoutes from './routes/UserRoutes.js';
const app = express()
const port = 3000

// middlewards
app.use(express.json())
app.use(companyRoutes);
app.use(userRoutes);

app.listen(port, async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/TestDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
  catch (e) {
    console.log("Error de conexión a la DB")
  }
  console.log(`Example app listening at http://localhost:${port}`)
})
