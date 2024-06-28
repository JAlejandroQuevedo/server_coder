import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null);

const collection = 'products';
const schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: String, required: true },
    status: { type: Boolean, required: false },
    category: { type: String, required: true },
    thumbnail: { type: Object, required: false },
    code: { type: String, required: true },
    stock: { type: String, required: false }
});

schema.plugin(mongoosePaginate)
const modelProducts = mongoose.model(collection, schema);

export { modelProducts };