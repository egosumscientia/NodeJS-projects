import User from '../models/UserModel.js'

const login = async (userData) => {
    
    const {email, password} = userData;

    if(email && password){
        const userDataFetched = await User.findOne({email:email,password:password});
        delete userDataFetched.password;
        const user = {
            email: userDataFetched.email,
            role: userDataFetched.role,
            store: userDataFetched.store
        };
        return user;
    }
    else{
        return {
            error: "The combination email/user doesn't exist."
        };
    };
};

//HERE THE REST OF THE FUNCTIONS...
const addme = async(userData)=>{

    const {name, email, password, role, store} = userData;

    if(name && email && password && role && store){
        const newUser = new User({
            name: name,
            email: email,
            password: password,
            role: role, 
            store: store
        });
        
        const aNewUser = await newUser.save(function (err) {
            if (err) return console.log(err);
        });
        console.log(aNewUser);
        return aNewUser;

    }else{
        return "All the fields are required";
    }

};

const deletemyaccount = async(userData)=>{

    const {email} = userData;

    if(email){
        //const deletedAccount = await User.findOneAndDelete({email:email})
        const deletedAccount = await User.deleteOne({email:email});

        console.log(deletedAccount);
        return(deletedAccount);
    }else{
        return "The email is required";
    }

};

const editmydata = async(userData)=>{

    const {name, email, password, role, store} = userData;

    const updateOneUser = await User.findOneAndUpdate({email:email},{name:name, password:password, role:role, store:store});

    console.log(updateOneUser);
    return updateOneUser;
};

//Admin's functions on users.
const findusers = async(userData)=>{

    const {email} = userData;

    if(email){
        let findUser = await User.find({email:email});
        console.log(findUser);
        return(findUser);
    }else{
        return {error: "There was an error"};
    }

};

const deleteuser = async(userData)=>{

    const {email} = userData;

    if(email){
        const delUser = await User.deleteOne({email:email});
        console.log(delUser);
        return(delUser);
    }else{
        return {error: "There was an error deleting the user..."};
    }

};

const adduser = async(userData)=>{

    const {name, email, password, role, store} = userData;

    if(email){
        const newUser = new User({
            name: name,
            email: email,
            password:password,
            role:role,
            store:store
        });
        const aNewUser = await newUser.save();
        console.log(aNewUser);
        return(aNewUser);
    }else{
        return {error: "There was an error saving the data..."};
        
    }

};

const edituser = async(userData)=>{

    const {name, email, password, role, store} = userData;

    if(name&email&password&role&store){
        const userToEdit = new User({
            name: name,
            email: email,
            password:password,
            role:role,
            store:store
        });

        const edUser = await userToEdit.findOneAndUpdate({email:email},{name:name,password:password,role:role,store:store});
        console.log(edUser);
        return(edUser);

    }else{
        return {error: "There was an error editing the data..."};
    }

};

const userController = {
    login,
    addme,
    deletemyaccount,
    editmydata,
    findusers,
    deleteuser,
    adduser,
    edituser
}
export default userController;