import { expect } from 'chai';
import sinon from 'sinon';
import { ManagerLogin } from '../../src/controllers/dao/manager/managerLogin.mdb.js';
import { modelUsers } from '../../src/controllers/dao/models/users.model.js';
import { createHash, isValidPassword } from '../../src/services/utils/bycript.js';
import { logger } from '../../src/services/log/logger.js';
describe('ManagerLogin', () => {
    let findStub, findOneStub, createStub, updateOneStub, loggerInfoStub, loggerWarnStub, loggerErrorStub;

    before(() => {
        // Stubs para los métodos de Mongoose
        findStub = sinon.stub(modelUsers, 'find');
        findOneStub = sinon.stub(modelUsers, 'findOne');
        createStub = sinon.stub(modelUsers, 'create');
        updateOneStub = sinon.stub(modelUsers, 'updateOne');

        // Stubs para el logger
        loggerInfoStub = sinon.stub(logger, 'info');
        loggerWarnStub = sinon.stub(logger, 'warn');
        loggerErrorStub = sinon.stub(logger, 'error');
    });

    after(() => {
        // Restaurar los stubs después de todos los tests
        if (findStub) findStub.restore();
        if (findOneStub) findOneStub.restore();
        if (createStub) createStub.restore();
        if (updateOneStub) updateOneStub.restore();
        if (loggerInfoStub) loggerInfoStub.restore();
        if (loggerWarnStub) loggerWarnStub.restore();
        if (loggerErrorStub) loggerErrorStub.restore();
    });

    describe('adminAuth', () => {
        it('debería permitir el acceso si el rol es admin', (done) => {
            const req = { session: { user: { role: 'admin' } } };
            const res = {};
            const next = () => {
                done();
            };
            ManagerLogin.adminAuth(req, res, next);
        });
    });

    describe('getUsers', () => {
        it('debería retornar una lista de usuarios', async () => {
            const users = [{ name: 'John Doe' }];
            findStub.resolves(users);

            const result = await ManagerLogin.getUsers();
            expect(result).to.deep.equal(users);
        });

    });

    describe('getOne', () => {
        it('debería retornar un usuario según el filtro proporcionado', async () => {
            const user = { name: 'John Doe' };
            findOneStub.resolves(user);

            const result = await ManagerLogin.getOne({ email: 'john.doe@example.com' });
            expect(result).to.deep.equal(user);
        });
    });

    describe('addUser', () => {
        it('debería agregar un nuevo usuario', async () => {
            createStub.resolves();

            await ManagerLogin.addUser('John', 'Doe', 'john.doe@example.com', 'male', 'password123');

            expect(createStub.calledOnce).to.be.true;
            expect(createStub.firstCall.args[0]).to.deep.equal({
                name: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                gender: 'male',
                password: 'password123'
            });
        });
    });


    describe('updateUsers', () => {
        it('debería actualizar el rol del usuario', async () => {
            const _id = 'userId';
            const role = 'admin';

            await ManagerLogin.updateUsers(_id, role);

            expect(updateOneStub.calledOnce).to.be.true;
            expect(updateOneStub.firstCall.args[0]).to.deep.equal({ _id: _id });
            expect(updateOneStub.firstCall.args[1]).to.deep.equal({ $set: { role: role } });
        });
    });
});