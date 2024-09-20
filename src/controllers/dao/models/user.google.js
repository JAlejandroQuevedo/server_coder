import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null);

const collection = 'users_google';
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['admin', 'premium', 'user'], default: 'user' },
    last_conection: { type: String, required: true },
    documents: [
        {
            name: {
                type: String,
                required: false
            },
            reference: {
                type: String,
                required: false
            }
        }
    ],
    conection: { type: Date, required: false }
});
schema.plugin(mongoosePaginate)
const modelUsersGoogle = mongoose.model(collection, schema);

export { modelUsersGoogle };