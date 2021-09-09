import express from 'express';
import cors from 'cors';
import userRoutes from './routes/UserRoutes.js';
const app = express()
const port = 3000
app.use(express.json())
app.use(cors({origin: true}))
// routes
app.use(userRoutes);



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})