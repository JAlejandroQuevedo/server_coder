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
describe('Test Integración Tickets', function () {

    // Primero, asegurémonos de que el usuario esté autenticado para poder crear un ticket.
    before(async function () {

    });

    it('GET /tickets debe devolver la lista de tickets', async function () {
        // const result = await requester.post('/api/auth/jwtlogin').send(user);
        const { _body } = await requester.get('/api/tickets').set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(_body.origin).to.be.ok;
        expect(_body.tickets).to.be.an('array');
    });

    it('POST /tickets debe crear un nuevo ticket', async function () {
        const result = await requester.post('/api/tickets').send(_id);
        const { _body } = await requester.get('/api/tickets').set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(_body.origin).to.be.ok;
        expect(_body.tickets).to.be.an('array');
        expect(result).to.be.not.undefined;
    });

});
