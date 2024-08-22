import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
// import { ManagerLogin } from '../../src/controllers/dao/manager/managerLogin.mdb.js';
import { modelUsers } from '../../src/controllers/dao/models/users.model.js';
// import { createHash, isValidPassword } from '../../src/services/utils/bycript.js';

// Utilizamos proxyquire para reemplazar las dependencias durante las pruebas
const { createHash, isValidPassword } = proxyquire('../src/services/utils/bycript.js', {
    'bcrypt': {
        hashSync: sinon.stub().returns('hashedPassword'),
        compareSync: sinon.stub().callsFake((password, hashedPassword) => password === 'correctPassword') // Adaptar a la función real
    }
});

const ManagerLogin = proxyquire('../src/dao/ManagerLogin.js', {
    '../services/utils/bycript.js': { createHash, isValidPassword }
}).ManagerLogin;

describe('Test DAO ManagerLogin', () => {
    let findStub, findOneStub, createStub, updateOneStub;

    before(() => {
        // Stub de los métodos de Mongoose para evitar interacciones reales con la base de datos
        findStub = sinon.stub(modelUsers, 'find').resolves([]);
        findOneStub = sinon.stub(modelUsers, 'findOne').resolves(null);
        createStub = sinon.stub(modelUsers, 'create').resolves();
        updateOneStub = sinon.stub(modelUsers, 'updateOne').resolves();

        // Stubs para funciones de bcrypt
        sinon.stub(createHash, 'createHash').returns('hashedPassword');
        sinon.stub(isValidPassword, 'isValidPassword').returns(false);
    });

    after(() => {
        // Restaurar los stubs después de todos los tests
        sinon.restore();
    });

    it('adminAuth() debería permitir el acceso solo a los administradores', () => {
        const req = { session: { user: { role: 'admin' } } };
        const res = {};
        const next = sinon.spy();

        ManagerLogin.adminAuth(req, res, next);
        expect(next.calledOnce).to.be.true;
    });

    it('adminAuth() debería denegar el acceso a usuarios no administradores', () => {
        const req = { session: { user: { role: 'user' } } };
        const res = { status: sinon.stub().returnsThis(), send: sinon.spy() };
        const next = sinon.spy();

        ManagerLogin.adminAuth(req, res, next);
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.send.calledWith({ origin: 'config.SERVER', payload: 'Acceso no autorizado: se requiere autenticación y nivel de admin' })).to.be.true;
        expect(next.notCalled).to.be.true;
    });

    it('getUsers() debería retornar un array de usuarios', async () => {
        findStub.resolves([{ name: 'John Doe', email: 'john.doe@example.com' }]);

        const result = await ManagerLogin.getUsers();
        expect(result).to.be.an('array');
        expect(result[0].email).to.equal('john.doe@example.com');
    });

    it('getOne() debería retornar un usuario según el filtro proporcionado', async () => {
        const filter = { email: 'john.doe@example.com' };
        findOneStub.resolves({ name: 'John Doe', email: 'john.doe@example.com' });

        const result = await ManagerLogin.getOne(filter);
        expect(result).to.be.an('object');
        expect(result.email).to.equal('john.doe@example.com');
    });

    it('addUser() debería agregar un nuevo usuario', async () => {
        const user = {
            name: 'Jane Doe',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            gender: 'female',
            password: 'password123'
        };

        await ManagerLogin.addUser(user.name, user.lastName, user.email, user.gender, user.password);

        expect(createStub.calledOnce).to.be.true;
        expect(createStub.firstCall.args[0]).to.deep.equal(user);
    });

    it('updatePassword() debería actualizar la contraseña del usuario si es válida', async () => {
        const email = 'john.doe@example.com';
        const newPassword = 'newPassword123';
        const verifyPassword = 'newPassword123';

        await ManagerLogin.updatePassword(email, newPassword, verifyPassword);

        expect(updateOneStub.calledOnce).to.be.true;
        expect(updateOneStub.firstCall.args[0]).to.deep.equal({ email: email });
        expect(updateOneStub.firstCall.args[1]).to.deep.equal({ $set: { password: 'hashedPassword' } });
    });

    it('updatePassword() debería no actualizar la contraseña si es la misma que la anterior', async () => {
        isValidPassword.returns(true);
        const email = 'john.doe@example.com';
        const password = 'password123';
        const verifyPassword = 'password123';

        await ManagerLogin.updatePassword(email, password, verifyPassword);

        expect(updateOneStub.notCalled).to.be.true;
    });

    it('updateUsers() debería actualizar el rol del usuario', async () => {
        const userId = 'userId';
        const role = 'admin';

        await ManagerLogin.updateUsers(userId, role);

        expect(updateOneStub.calledOnce).to.be.true;
        expect(updateOneStub.firstCall.args[0]).to.deep.equal({ _id: userId });
        expect(updateOneStub.firstCall.args[1]).to.deep.equal({ $set: { role: role } });
    });
}); 