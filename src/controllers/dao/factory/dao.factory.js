import { config } from '../../config/config.js';
import { MongoSingleton } from '../../../services/db/mongo.singleton.js';
import { modelProducts } from '../models/products.model.js';
// import { ProctManager } from '../fs/productManager/productManager.js';


let factoryProductService = {};

switch (config.PERSISTENCE) {
    case 'mongo':
        try {
            console.log('Persistencia a MONGODB');
            await MongoSingleton.getInstance();
            factoryProductService = modelProducts;
        }
        catch (err) {
            console.error('Error al conectar a MongoDB:', err);
            throw new Error('Error en la persistencia a MONGODB');
        }

        break;

    default:
        throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}

export default factoryProductService;