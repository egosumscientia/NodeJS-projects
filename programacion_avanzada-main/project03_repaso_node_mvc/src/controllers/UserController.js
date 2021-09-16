import User from '../models/UserModel.js'

const login = async (userData) => {
    
    const {email, password} = userData

    if(email){
        const userData = await User.findOne({email:email,password:password});
        delete userData.password;
        const user = {
            email: userData.email,
            role: userData.role,
            shop: userData.shop
        }
        return user;
    }
    else{
        return {
            error: "No existe el correo"
        }
    }
}

const register = () => {
    return { status: "registered" }
}

const userController = {
    register,
    login
}
export default userController;