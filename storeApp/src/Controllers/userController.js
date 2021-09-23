import User from '../models/UserModel.js'

const login = async (userData) => {
    
    const {email, password} = userData;

    try{
        if(email !== "" && password !== ""){
            const userDataFetched = await User.findOne({email:email,password:password});
            if(userDataFetched){
                    console.log(userDataFetched);
                    delete userDataFetched.password;
                    const user = {
                    email: userDataFetched.email,
                    role: userDataFetched.role,
                    store: userDataFetched.store
                }
                return user;
            }
            else{
                return "The combination email/password doesn't exist. =("
            }
        }
        else{
            return {
                error: "All the fields are required"
            };
        };
    }catch(e){
        return {error: console.error(e)};
    }

};

//HERE THE REST OF THE FUNCTIONS...
const addme = async(userData)=>{

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
        return {error: console.error(e)};
    };

};

const deletemyaccount = async(userData)=>{

    const {email} = userData;

    try{
        if(email){
            //const deletedAccount = await User.findOneAndDelete({email:email})
            const deletedAccount = await User.deleteOne({email:email});
            console.log(deletedAccount);
            return deletedAccount;
        }else{
            return "The email is required";
        }
    }catch(e){
        return {error: console.error(e)};
    }

    
};

const editmydata = async(userData)=>{

    const {name, email, password, role, store} = userData;

    try{
        if(name !== "" && email !== ""){
            const editedUser = await User.findOneAndUpdate({email:email},{name:name,password:password,role:role,store:store});
            return(editedUser);
        }else{
            return {error:"Your email address is required / or is being used."}
        }     
    }catch(e){
        return {error: console.error(e)};
    };
};

//Admin's functions on users.
const finduser = async(userData)=>{

    const {email} = userData;

    try{
        if(email){
            let findUser = await User.find({email:email});
            return(findUser);
        }else{
            return {error: "The user does not exist"};
        }
    }catch(e){
        return {error: console.error(e)};
    }

};

const deleteuser = async(userData)=>{

    const {email} = userData;

    try{
        if(email){
            const delUser = await User.deleteOne({email:email});
            return(delUser);
        }else{
            return {error: "There was an error deleting the user..."};
        }
    }catch(e){
        return console.log(e);
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
                return {error: "Your name is required"};
            }
        }else{
            return {error:"The email address is required"}
        }     
    }catch(e){
        return {error: console.error(e)};
    };

};

const edituser = async(userData)=>{

    const {name, email, password, role, store} = userData;

    try{
        if(name !== "" && email !== ""){
            const edUser = await User.findOneAndUpdate({email:email},{name:name,password:password,role:role,store:store});
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