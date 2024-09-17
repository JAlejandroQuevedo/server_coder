import { config } from '../../config/config.js';
import { MongoSingleton } from '../../../services/db/mongo.singleton.js';
import { logger } from '../../../services/log/logger.js';
// import { modelProducts } from '../models/products.model.js';
// import { ProctManager } from '../fs/productManager/productManager.js';


// let factoryProductService = {};
const factory = async () => {
    switch (config.PERSISTENCE) {
        case 'mongo':
            try {
                logger.info('Persistencia a MONGODB');
                await MongoSingleton.getInstance();
            }
            catch (err) {
                logger.error('Error al conectar a MongoDB:', err);
                throw new Error('Error en la persistencia a MONGODB');
            }
            break;

        case 'fs':
            logger.info('Persistencia a JSON')
            break;
        default:
            throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
    }

}


export { factory };