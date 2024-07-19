import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'users_gitHub';
const schema = new mongoose.Schema({
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: false },
    age: { type: Number, required: false },
    password: { type: String, required: false },
    cartId: { type: String, required: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

const modelUserGit = mongoose.model(collection, schema);

export { modelUserGit };