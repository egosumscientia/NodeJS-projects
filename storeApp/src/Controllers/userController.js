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
            error: "The combination email/password doesn't exist."
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
const finduser = async(userData)=>{

    const {name, email, password, role, store} = userData;
    console.log(email);

    if(email){
        console.log("IM INSIDE!");
        let findUser = await User.find({email:email});
        console.log(findUser);
        return(findUser);
    }else{
        return {error: "There was an error"};
    }

};

const deleteuser = async(userData)=>{

    const {name, email, password, role, store} = userData;
    console.log(email);

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

    try{
        if(email){
            if(name){
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
                return {error: "The email address is required"};
            }
        }else{
            return {error:"The name is required"}
        }     
    }catch(e){
        return {error: "The email address exists already."};
    };

};

const edituser = async(userData)=>{

    const {name, email, password, role, store} = userData;
    console.log(name);
    console.log(email);

    try{
        if(name !== "" && email !== ""){
            console.log("WHOOOAA");
            const edUser = await User.findOneAndUpdate({email:email},{name:name,password:password,role:role,store:store});
            console.log(edUser);
            return(edUser);
        }else{
            return {error:"Your email address is required / or is being used."}
        }     
    }catch(e){
        return {error: "Error editing the data."};
    };

};

const userController = {
    login,
    addme,
    deletemyaccount,
    editmydata,
    finduser,
    deleteuser,
    adduser,
    edituser
}
export default userController;