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


//Admin's functions on users.
userRoutes.route('/finduser').get(async(req,res)=>{
    res.json('GET request to the findusers page');
}).post(async(req,res)=>{
    let findUsers = await userController.finduser(req.body);
    res.json(findUsers);
});

userRoutes.route('/deleteuser').get(async(req,res)=>{
    res.json('GET request to the deleteuser page');
}).post(async(req,res)=>{
    let deleteUser = await userController.deleteuser(req.body);
    res.json(deleteUser);
})

userRoutes.route('/adduser').get(async(req, res)=>{
    res.send("GET request to the adduser page");
}).post(async(req,res)=>{
    let addUser = await userController.adduser(req.body);
    res.json(addUser);
});

userRoutes.route('/edituser').get(async(req,res)=>{
    res.json('GET request to the edituser page');
}).post(async(req,res)=>{
    let editUser = await userController.edituser(req.body);
    res.json(editUser);
})


export default userRoutes;