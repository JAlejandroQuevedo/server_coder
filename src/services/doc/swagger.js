import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de multiservicios server_coder',
            description: 'Esta documentación cubre toda la API habilitada para server_coder',
        },
    },
    apis: ['./src/docs/**/*.yaml'], // todos los archivos de configuración de rutas estarán aquí
};

export const specs = swaggerJsdoc(swaggerOptions);