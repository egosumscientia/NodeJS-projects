import express from 'express';
import userController from '../Controllers/userController.js';
const userRoutes = express.Router();

//Home
userRoutes.get('/', async(req,res)=>{
    /* res.status("202"); */
    const data = "HELLO WORLD";
    res.json(data);
});


//LOGIN
userRoutes.get('/login', (req,res) => {
    res.json('GET request to the login page');
});
userRoutes.post('/login', async(req,res)=>{
    let data = await userController.login(req.body);
    res.json(data);
});

//Customer's routes
userRoutes.get('/addme',async(req,res)=>{
    res.json('GET request to the addme page');
});
userRoutes.post('/addme',async(req,res)=>{
    let addMe = await userController.addme(req.body);
    res.json(addMe);
});

userRoutes.get('/deletemyaccount',async(req,res)=>{
    res.json('GET request to the deletemyaccount page');
});
userRoutes.delete('/deletemyaccount',async(req,res)=>{
    let deleteMe = await userController.deletemyaccount(req.body);
    res.json(deleteMe)
});

userRoutes.get('/editmydata',async(req,res)=>{
    res.json('GET request to the editmydata page');
});
userRoutes.post('/editmydata',async(req,res)=>{
    let editMyData = await userController.editmydata(req.body);
    res.json(editMyData);
});


//Admin's functions
userRoutes.get('/findusers', async(req,res)=>{
    res.json('GET request to the findusers page');
});
userRoutes.post('/findusers', async(req,res)=>{
    let findUsers = await userController.findusers(req.query);
    res.json(findUsers);
});

userRoutes.get('/deleteuser', async(req,res)=>{
    res.json('GET request to the deleteuser page');
});
userRoutes.delete('/deleteuser', async(req,res)=>{
    let deleteUser = await userController.deleteuser(req.body);
    res.json(deleteUser);
});

userRoutes.get('/adduser', async(req,res)=>{
    res.json('GET request to the adduser page');
});
userRoutes.post('/adduser', async(req,res)=>{
    let addUser = await userController.adduser(req.body);
    res.json(addUser);
});

userRoutes.get('/edituser', async(req,res)=>{
    res.json('GET request to the edituser page');
});
userRoutes.post('/edituser', async(req,res)=>{
    let editUser = await userController.edituser(req.body);
    res.json(editUser);
});


export default userRoutes;