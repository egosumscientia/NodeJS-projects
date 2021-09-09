import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserModel = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: false },
    identification: { type: Number, required: true },
});

const User = mongoose.model('user', UserModel);
export default User;