import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'users_current';
const schema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cartId: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

const modelUsersCurrent = mongoose.model(collection, schema);

export { modelUsersCurrent };