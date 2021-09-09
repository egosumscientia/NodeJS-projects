const login = (userData) => {
    
    if(userData.email){
        return {
            name: "juan",
            password: "123456",
            role: "admin"
        }
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