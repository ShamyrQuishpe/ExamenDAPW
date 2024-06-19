import { expect } from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import fs from 'fs-extra';
import Reports_r from '../src/models/res_reports.js';
import { 
    getAllRespuestaRController, 
    createRespuestaRController, 
    getRespuestaRByIdController, 
    updateRespuestaRController, 
    deleteRespuestaRController 
} from '../src/controllers/respuestaR_controller.js';
//Grupo de pruebas para respuestas de reportes (CRUD)
describe('Res Reports Controllers', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    //Grupo de pruebas para obtener respuestas dereportes
    describe('getAllRespuestaRController', () => {
        it('should get all reports', async () => {
            sinon.stub(Reports_r, 'find').resolves([{}]);

            await getAllRespuestaRController(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.array)).to.be.true;
        });

        it('should handle errors', async () => {
            sinon.stub(Reports_r, 'find').throws(new Error('Test error'));

            await getAllRespuestaRController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });
    });

    //Grupo de pruebas para crear respuestas de reportes
    describe('createRespuestaRController', () => {
        it('should create a new report', async () => {
            req.body = { direction: 'test', description: 'test', ci: 123456, state: 'test' };
            const newReport = {
                ...req.body,
                _id: 'test_id',
                date: new Date()
            };
            sinon.stub(Reports_r.prototype, 'save').resolves(newReport);

            await createRespuestaRController(req, res, next);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(newReport)).to.be.true;
        });

        it('should handle errors', async () => {
            req.body = { direction: 'test', description: 'test', ci: 123456, state: 'test' };
            sinon.stub(Reports_r.prototype, 'save').throws(new Error('Test error'));

            await createRespuestaRController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });
    });

    //Grupo de pruebas para obtener respuestas dereportes por ID
    describe('getRespuestaRByIdController', () => {
        it('should get a report by id', async () => {
            req.params.id = 'test_id';
            const report = { _id: 'test_id', direction: 'test' };
            sinon.stub(Reports_r, 'findById').resolves(report);

            await getRespuestaRByIdController(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(report)).to.be.true;
        });

        it('should handle report not found', async () => {
            req.params.id = 'test_id';
            sinon.stub(Reports_r, 'findById').resolves(null);

            await getRespuestaRByIdController(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });

        it('should handle errors', async () => {
            req.params.id = 'test_id';
            sinon.stub(Reports_r, 'findById').throws(new Error('Test error'));

            await getRespuestaRByIdController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });
    });

    //Grupo de pruebas para actualizar respuestas de reportes 
    describe('updateRespuestaRController', () => {
        it('should update a report', async () => {
            req.params.id = 'test_id';
            req.body = { direction: 'updated', description: 'updated', ci: 654321, state: 'updated' };
            const updatedReport = { ...req.body, _id: 'test_id' };
            sinon.stub(Reports_r, 'findByIdAndUpdate').resolves(updatedReport);

            await updateRespuestaRController(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(updatedReport)).to.be.true;
        });

        it('should handle report not found', async () => {
            req.params.id = 'test_id';
            req.body = { direction: 'updated', description: 'updated', ci: 654321, state: 'updated' };
            sinon.stub(Reports_r, 'findByIdAndUpdate').resolves(null);

            await updateRespuestaRController(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });

        it('should handle errors', async () => {
            req.params.id = 'test_id';
            req.body = { direction: 'updated', description: 'updated', ci: 654321, state: 'updated' };
            sinon.stub(Reports_r, 'findByIdAndUpdate').throws(new Error('Test error'));

            await updateRespuestaRController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });
    });

    //Grupo de pruebas para eliminar respuestas de reportes 
    describe('deleteRespuestaRController', () => {
        beforeEach(() => {
            req.params.id = 'testId';
        });
        it('should delete a report', async () => {
            const report = { _id: 'test_id'};
            sinon.stub(Reports_r, 'findById').resolves(report);
            sinon.stub(Reports_r, 'findByIdAndDelete').resolves(report);

            await deleteRespuestaRController(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });

        it('should handle report not found', async () => {
            req.params.id = 'test_id';
            sinon.stub(Reports_r, 'findById').resolves(null);

            await deleteRespuestaRController(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });

        it('should handle errors', async () => {
            req.params.id = 'test_id';
            sinon.stub(Reports_r, 'findById').throws(new Error('Test error'));

            await deleteRespuestaRController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith(sinon.match.object)).to.be.true;
        });
    });
});
