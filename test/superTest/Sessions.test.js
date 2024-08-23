import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const connection = await mongoose.connect('mongodb+srv://alejandroya24:6UU6PFUUMVOYtOKe@ecomerce.rdduzzd.mongodb.net/Ecommerce');
const requester = supertest('http://localhost:8080');
let session = {};
let _id = { _id: '667b1021adf99bf803de4c76' }
// _user_id = req.session.user._id

let cookie = {};
const user = {
    "email": "alejandro_ya23@hotmail.com",
    "password": "123"
}
const user_register = {
    "name": "Jesus",
    "lastName": "Manila",
    "email": "palomavoladora30@gmail.com",
    "gender": "Male",
    "password": "$2b$10$.w/GfAVYYgDZQM5YnZ3bNuZKMN4CoqO/FAVi9jSeT3p1QBzRbiQs.",
}
describe('Test Integración Tickets', function () {

    // Primero, asegurémonos de que el usuario esté autenticado para poder crear un ticket.
    before(async function () {

    });
    it('POST /api/sessions/register debe registrar un nuevo usuario', async function () {
        const { _body } = await requester.post('/api/auth/register').send(user_register);

        expect(_body.error).to.be.undefined;
        expect(_body.payload).to.be.ok;
    });

    it('POST /api/auth/jwtlogin debe ingresar correctamente al usuario', async function () {
        const result = await requester.post('/api/auth/jwtlogin').send(user);
        const cookieData = result.headers['set-cookie'][0];
        cookie = { name: cookieData.split('=')[0], value: cookieData.split('=')[1] };

        expect(cookieData).to.be.ok;
        // expect(cookie.name).to.be.equals('coderCookie');
        expect(cookie.value).to.be.ok;
    });

});
