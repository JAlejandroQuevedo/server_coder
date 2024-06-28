import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null);

const collection = 'users_index';
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
});

const modelUsers = mongoose.model(collection, schema);

export { modelUsers };