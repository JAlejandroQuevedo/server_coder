export const loggers = [
    {
        products: {
            info: {
                succesGetProducts: [
                    'Productos obtenidos de manera exitosa',
                    'Producto obtenido de manera exitosa',
                ],
                succesPostProducts: [
                    'Producto agregado con exito',

                ],
                succesPutProducts: [
                    'Producto actualizado con exito'
                ],
                successDeleteProducts: [
                    'Producto eliminado correctamente'
                ]

            },
            error: {
                errorGetProducts: [
                    'Lo siento, no contamos con la cantidad de productos solicitada',
                    'Hubo un error al obtener los pruductos:',
                    'El producto solicitado no existe',
                    'Error al cargar el obtener por ID:',
                    'Error al obtener los datos de la pagina solicitada'
                ],
                errorPostProducts: [
                    'Error al agregar el producto:'
                ],
                errorPutProducts: [
                    'Error al actualizar el producto por ID'
                ],
                errorDeleteProducts: [
                    'Lo siento no se pudo eliminar el producto'
                ]
            }
        },
        carts: {
            info: {
                succesGetCarts: [
                    'Productos del carrito obtenidos de manera exitosa',
                    'Historial obtenido de manera exitosa',
                    'Producto obtenido de manera exitosa',
                    'Compra finalizada con exito'

                ],
                succesPostCarts: [
                    'Producto agregado con exito al carrito',

                ],
                succesPutCarts: [
                    'Producto actualizado con exito',
                    'Cantidad del producto actualizada con exito'
                ],
                successDeleteCarts: [
                    'Producto eliminado correctamente',
                    'Productos eliminados correctamente'
                ]

            },
            error: {
                errorGetCarts: [
                    'Lo siento, no contamos con la cantidad de productos solicitada',
                    'Hubo un error al obtener los pruductos:',
                    'Error al obtener el historial del carrito:',
                    'El producto solicitado no existe',
                    'Error al cargar el obtener por ID:',
                    'Error al obtener los datos del carrito de la pagina solicitada',
                    'Error al agregar el producto:'
                ],
                errorPostCarts: [
                    'Error al agregar el producto:'
                ],
                errorPutCarts: [
                    'Error al actualizar el producto por ID',
                    'Error al actualizar la cantidad del producto: '
                ],
                errorDeleteCarts: [
                    'Lo siento no se pudo eliminar el producto',
                    'Lo siento no se pudieron eliminar los productos'

                ]
            }
        },
        tickets: {
            info: {
                succesGetTickets: [
                    'Tickets obtenidos de manera exitosa'
                ],
                succesPostTickets: [
                    'Ticket creado con exito'

                ]

            },
            error: {
                errorGetTickets: [
                    'Hubo un error al obtener los tickes:'
                ],
                errorPostTickets: [
                    'Error al ingresar el ticket del producto:'
                ]
            }
        },
        login: {
            info: {
                succesGetUsers: [
                    'Usuarios obtenidos de manera exitosa',
                    'Usuario creado de manera exitosa',
                    'Producto obtenido de manera exitosa',
                    'Compra finalizada con exito'

                ],
                succesPostCarts: [
                    'Producto agregado con exito al carrito',

                ],
                succesPutCarts: [
                    'Producto actualizado con exito',
                    'Cantidad del producto actualizada con exito'
                ],
                successDeleteCarts: [
                    'Producto eliminado correctamente',
                    'Productos eliminados correctamente'
                ]

            },
            error: {
                errorGetCarts: [
                    'Lo siento, no contamos con la cantidad de productos solicitada',
                    'Hubo un error al obtener los pruductos:',
                    'Error al obtener el historial del carrito:',
                    'El producto solicitado no existe',
                    'Error al cargar el obtener por ID:',
                    'Error al obtener los datos del carrito de la pagina solicitada',
                    'Error al agregar el producto:'
                ],
                errorPostCarts: [
                    'Error al agregar el producto:'
                ],
                errorPutCarts: [
                    'Error al actualizar el producto por ID',
                    'Error al actualizar la cantidad del producto: '
                ],
                errorDeleteCarts: [
                    'Lo siento no se pudo eliminar el producto',
                    'Lo siento no se pudieron eliminar los productos'

                ]
            }
        }
    }
]
// import { loggers } from "./controllers/config/message.logger.js";
// loggers.map(({ products, carts }) => console.log(carts))