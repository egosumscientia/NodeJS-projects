import express from 'express';
import userController from '../controllers/UserController.js'
const userRoutes = express.Router();

userRoutes.post('/login', (req,res) =>{
    
    let data = userController.login(req.body);
    res.json(data);
})

userRoutes.get('/register', (req,res) =>{
    res.json({status: "register"})
})
userRoutes.get('/filter', (req,res) =>{
    res.json({status: "filter"})
})

export default userRoutes;
