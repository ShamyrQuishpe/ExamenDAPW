import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import User from '../src/models/user.js';
import { createToken } from '../src/middlewares/auth.js';
import {
    registerUserController,
    loginUserController
} from '../src/controllers/user_controller.js';
//Pruebas Modulo controlador de usuarios
describe('User Controller', () => {
    let req, res, next;
    //Segmento que se va ejecutar antes de cada prueba
    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    //Segmento que se va despues antes de cada prueba
    afterEach(() => {
        sinon.restore();
    });

    //Grupo de pruebas para el registro del usuario
    describe('registerUserController', () => {
        beforeEach(() => {
            req.body = { email: 'test@test.com', password: 'password123' };
        });
        afterEach(()=>{

        })
        //Prueba para registrar un nuevo usuario
        it('should register a new user', async () => {
            /*Se manda sin un email ya que si se manda uno, entra directamente al if ubicando en el controlador
            y atrapa el status 404 ubicado en el mismo*/
            sinon.stub(User, 'findOne').resolves(); 
            sinon.stub(bcrypt, 'hash').resolves(req.body,'hashedpassword');
            sinon.stub(User.prototype, 'save').resolves();

            await registerUserController(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });

        //Prueba para manejar si un email ya existe
        it('should handle email already exists', async () => {
            sinon.stub(User, 'findOne').resolves({ email: 'test@test.com' });

            await registerUserController(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: "Email ya existe" })).to.be.true;
        });

        //Prueba para manejar errores en la funcion de registro
        it('should handle errors', async () => {
            sinon.stub(User, 'findOne').rejects(new Error('Error'));

            await registerUserController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: "Error en el registro del email" })).to.be.true;
        });
    });

    //Grupo de pruebas para el login del usuario
    describe('loginUserController', () => {
        beforeEach(() => {
            req.body = { email: 'test@test.com', password: 'password123' };
        });
        //Prueba para que un usuario se pueda loguear 
        it('should login a user', async () => {
            const user = { _id: '123', email: 'test@test.com', password: 'hashedpassword' };
            sinon.stub(User, 'findOne').resolves(user);
            sinon.stub(bcrypt, 'compare').resolves(true);
            //El mandar un token en la prueba genera errores por ende se le descarta
            //sinon.stub(createToken, 'default').returns('token');

            await loginUserController(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });
        //Prueba para manejar si un email es invalido
        it('should handle invalid email', async () => {
            sinon.stub(User, 'findOne').resolves(null);

            await loginUserController(req, res, next);
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: "Username o password invalido" })).to.be.true;
        });

        //Prueba para manejar si una contraseña es incorrecta
        it('should handle invalid password', async () => {
            const user = { email: 'test@test.com', password: 'hashedpassword' };
            sinon.stub(User, 'findOne').resolves(user);
            sinon.stub(bcrypt, 'compare').resolves(false);

            await loginUserController(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: "Username o password invalido" })).to.be.true;
        });
        //Prueba para manejar errores en la funcion de registro
        it('should handle errors', async () => {
            sinon.stub(User, 'findOne').rejects(new Error('Error'));

            await loginUserController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: "Error en el login" })).to.be.true;
        });
    });
});