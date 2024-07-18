import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null);

const collection = 'cart_historial';

const schema = new mongoose.Schema({
    _product_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    _user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    thumbnail: { type: Object, required: false },
    stock: { type: Number, required: false },
    quantity: { type: Number, required: true }
});

schema.plugin(mongoosePaginate)
const cartHistorial = mongoose.model(collection, schema);

export { cartHistorial };