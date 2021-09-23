import express from 'express';
import mongoose from 'mongoose';
import Company from './models/CompanyModel.js';
const app = express()
const port = 3000

app.get('/', async (req, res) => {
  try {
    const data = await Company.find().sort({founded_month: -1}).limit(10);
    res.json(data);
  }
  catch(e){
    res.json(e)
  }
})

app.listen(port, async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/PRAvanzada', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
  catch (e) {
    console.log("Error de conexión a la DB")
  }
  console.log(`Example app listening at http://localhost:${port}`)
})
