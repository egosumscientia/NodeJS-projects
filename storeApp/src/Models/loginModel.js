import mongoose from 'mongoose';
const LoginSchema = mongoose.Schema;

const LoginModel = new LoginSchema({
    name: { type: String, required: true },
    email: { type: String, required: true },
});

const Login = mongoose.model('userLogin', LoginModel);
export default Login;