import Login from '../Models/loginModel.js';

const login = async (userLogin) => {
    
    const {email, password} = userData

    if(email){
        const userData = await Login.findOne({email:email,password:password});
        delete userData.password;
        const user = {
            name: userLogin.name,
            email: userLogin.email,
        }
        return user;
    }
    else{
        return {
            error: "The email doesn't exist..."
        }
    }
}

const register = () => {
    return { status: "You're successfully registered!" };
}


const loginController = {
    login,
    register
}
export default loginController;