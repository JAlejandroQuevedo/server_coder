# Server coder

## Endpoints con localhost
GET ALL:

http://localhost:8080/api/carts



GET BY ID:

http://localhost:8080/api/carts/665a7ba73b77b779354ed2a4



GET LIMIT:

http://localhost:8080/api/carts/?limit=2

GET PAGINATE (No lo pide la consigna pero ya esta hecho)
localhost:8080/api/ localhost:8080/api/cart/page/1




POST

http://localhost:8080/api/carts/664ce78f929e2b828ea815e0



PUT ALL 

http://localhost:8080/api/carts/665a7ba73b77b779354ed2a4



PUT QUANTITY

http://localhost:8080/api/cart/665a7ba73b77b779354ed2a4



Aqui lo quise hacer segun la consigna pero me dio un errorsaso porque si el put all y este llevan el mismo nombre o es uno o es otro, por eso le quite la s



http://localhost:8080/api/carts/665a7e6486561373ea05348c/products/2 (el 2 vendria siendo la quantity a cambiar)





VIEWS

http://localhost:8080/api/product

http://localhost:8080/api/cart



Las rutas de products no las modifique porque es lo que a venido mostrando el profe desde la clase 0 y se me hizo muy raro cambiar todo products directamente a "/"

Te dejo las rutas:

GET ALL:
 localhost:8080/api/products

GET LIMIT
 limit: http://localhost:8080/api/products?limit=2

GET ID
http://localhost:8080/api/products/664ce78f929e2b828ea815e0

GET PAGINATE
 localhost:8080/api/products/pages/1

POST PRODUCT
localhost:8080/api/products

PUT
http://localhost:8080/api/products/664ce78f929e2b828ea815e0

DELETE
http://localhost:8080/api/products/664ce78f929e2b828ea815e0

User

http://localhost:8080/api/auth/jwtlogin

Usuarios:
- alejandro_ya23@hotmail.com
- 123

- alejandro_ya24@hotmail.com
- 123
Intercambio de roles

http://localhost:8080/api/users/role/m0f1rac64f345ced16fe23eaedc07d55/66ec8ad0c50ebb4c62f74964 (Lo ultimo es un id de usuario jajaja)

GET Y DELETE
http://localhost:8080/api/users

Cambiar a usuario premium
http://localhost:8080/api/users/premium/documents/:uid

http://localhost:8080/login
http://localhost:8080/api/carts/purchase/:cid
http://localhost:8080/mockingproducts
http://localhost:8080/api/docs/#/
http://localhost:8080/api/users/premium/documents/667b1021adf99bf803de4c7

# Links de deploy

- https://servercoder-production.up.railway.app/payments
- https://servercoder-production.up.railway.app/login
