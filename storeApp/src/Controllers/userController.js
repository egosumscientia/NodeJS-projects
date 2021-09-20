import User from '../models/UserModel.js'

const login = async (userData) => {
    
    const {email, password} = userData;

    if(email && password){
        const userDataFetched = await User.findOne({email:email,password:password});
        delete userDataFetched.password;
        const user = {
            email: userDataFetched.email,
            role: userDataFetched.role,
            shop: userDataFetched.shop
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

    const {name, email, password, role, shop} = userData;

    if(name && email && password && role && shop){
        const newUser = new User({
            name: name,
            email: email,
            password: password,
            role: role, 
            shop: shop
        });
        
        const aNewUser = await newUser.save();
        console.log(aNewUser);
        return(aNewUser);

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

    const {name, email, password, role, shop} = userData;

    const updateOneUser = await User.findOneAndUpdate({email:email},{name:name, password:password, role:role, shop:shop});

    console.log(updateOneUser);
    return(updateOneUser);
};

const finduser = async(userData)=>{

    

};

const deleteuser = async(userData)=>{

    

};

const adduser = async(userData)=>{

    

};

const edituser = async(userData)=>{

    

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