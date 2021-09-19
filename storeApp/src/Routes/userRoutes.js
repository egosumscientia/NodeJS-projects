import express from 'express';
import userController from '../Controllers/userController.js';
const userRoutes = express.Router();


//Customer's routes
userRoutes.post('/addme',async(req,res)=>{
    let addMe = await userController.addme(req.body);
    res.json(addMe);
});

userRoutes.post('/deleteMyAccount',async(req,res)=>{
    let deleteMe = await userController.deletemyaccount(req.body);
    res.json(deleteMe)
});

userRoutes.post('/editMyData',async(req,res)=>{
    let editMyData = await userController.editmydata(req.body);
    res.json(editMyData);
});


//Admin's functions
userRoutes.get('/listUsers',async(req,res)=>{
    let listUsers = await userController.listusers(req.query);
    res.json(listUsers);
});

userRoutes.delete('/deleteUser',async(req,res)=>{
    let deleteUser = await userController.deleteuser(req.query);
    res.json(deleteUser);
});

userRoutes.post('/adduser',async(req,res)=>{
    let addUser = await userController.adduser(req.body);
    res.json(addUser);
});

userRoutes.post('/edituser',async(req,res)=>{
    let editUser = await userController.edituser(req.body);
    res.json(editUser);
});


export default userRoutes;