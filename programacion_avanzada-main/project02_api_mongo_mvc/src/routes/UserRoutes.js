import {Router} from 'express';
const userRoutes = Router();
import User from '../models/UserModel.js'

userRoutes.post('/register', async (req,res) =>{
    const {name, age, identification} =  req.body;
    const user = new User({
        name: name,
        age: age,
        identification: identification
    });
    await user.save();
    res.json("registered");
});

userRoutes.post('/login', (req,res) =>{
    res.json("Login");
});

export default userRoutes;