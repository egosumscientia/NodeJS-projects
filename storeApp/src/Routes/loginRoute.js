import express from 'express';
import loginController from '../Controllers/loginController';
const loginRoute = express.Router();

//Login
loginRoute.post('/login', async(req,res)=>{
    let data = await loginController.login(req.body);
    res.json(data);
});

export default loginRoute;