import mongoose from 'mongoose';
const UserSchema = mongoose.Schema;

const UserModel = new UserSchema({
    email: {type: String, require: true},
    password: {type: String, require: true},
    role: {type: String, require: true},
    shop: {type: String, require: false},
});

const User = mongoose.model("user",UserModel);

export default User;