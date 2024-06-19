import { expect } from 'chai';
import sinon from 'sinon';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs-extra';
import Report from '../src/models/reports.js';
import {
    getAllReportsController,
    createReportsController,
    getReportByIdController,
    updateReportController,
    deleteReportController
} from '../src/controllers/report_controller.js';
//Grupo de pruebas para reportes (CRUD)
describe('Reports Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            files: {}
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
    //Grupo de pruebas para obtener reportes
    describe('getAllReportsController', () => {
        it('should return all reports', async () => {
            const reports = [{}, {}];
            sinon.stub(Report, 'find').resolves(reports);

            await getAllReportsController(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(reports)).to.be.true;
        });

        it('should handle errors', async () => {
            sinon.stub(Report, 'find').rejects(new Error('Error'));

            await getAllReportsController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    //Grupo de pruebas para crear reportes
    describe('createReportsController', () => {
        beforeEach(() => {
            req.body = { direction: 'test', description: 'test', ci: 'test' };
            req.files.image = { tempFilePath: 'path/to/file' };
        });

        it('should create a new report', async () => {
            const cloudinaryResponse = { secure_url: 'image_url', public_id: 'public_id' };
            sinon.stub(cloudinary.uploader, 'upload').resolves(cloudinaryResponse);
            sinon.stub(fs, 'unlink').resolves();
            sinon.stub(Report.prototype, 'save').resolves();

            await createReportsController(req, res, next);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.called).to.be.true;
        });

        it('should handle validation errors', async () => {
            req.body = { direction: '', description: '', ci: '' };

            await createReportsController(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'All the values are required.' })).to.be.true;
        });

        it('should handle errors', async () => {
            sinon.stub(cloudinary.uploader, 'upload').rejects(new Error('Error'));

            await createReportsController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    //Grupo de pruebas para obtener reportes por ID
    describe('getReportByIdController', () => {
        it('should return a report by id', async () => {
            const report = {};
            req.params.id = 'testId';
            sinon.stub(Report, 'findById').resolves(report);

            await getReportByIdController(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(report)).to.be.true;
        });

        it('should handle not found', async () => {
            req.params.id = 'testId';
            sinon.stub(Report, 'findById').resolves(null);

            await getReportByIdController(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'Report not found' })).to.be.true;
        });

        it('should handle errors', async () => {
            req.params.id = 'testId';
            sinon.stub(Report, 'findById').rejects(new Error('Error'));

            await getReportByIdController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    //Grupo de pruebas para actualizar reportes 
    describe('updateReportController', () => {
        beforeEach(() => {
            req.body = { direction: 'updated', description: 'updated', ci: 'updated' };
            req.params.id = 'testId';
        });

        it('should update a report', async () => {
            const report = { save: sinon.stub() };
            sinon.stub(Report, 'findByIdAndUpdate').resolves(report);
            sinon.stub(fs, 'unlink').resolves();

            await updateReportController(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(report)).to.be.true;
        });

        it('should handle not found', async () => {
            sinon.stub(Report, 'findByIdAndUpdate').resolves(null);

            await updateReportController(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ error: 'Report no encontrado' })).to.be.true;
        });

        it('should handle errors', async () => {
            sinon.stub(Report, 'findByIdAndUpdate').rejects(new Error('Error'));

            await updateReportController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: 'Error al actualizar el reporte' })).to.be.true;
        });
    });

    //Grupo de pruebas para eliminar reportes 
    describe('deleteReportController', () => {
        beforeEach(() => {
            req.params.id = 'testId';
        });

        it('should delete a report', async () => {
            const report = { public_id: 'public_id' };
            const cloudinaryResponse = { secure_url: 'image_url', public_id: 'public_id' };
            sinon.stub(Report, 'findById').resolves(report);
            sinon.stub(cloudinary.uploader, 'destroy').resolves(cloudinaryResponse);
            sinon.stub(Report, 'findByIdAndDelete').resolves(report);

            await deleteReportController(req, res, next);
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Reporte eliminado correctamente' })).to.be.true;
        });

        it('should handle not found', async () => {
            sinon.stub(Report, 'findById').resolves(null);

            await deleteReportController(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ error: 'Reporte no encontrado' })).to.be.true;
        });

        it('should handle missing public_id', async () => {
            const report = {};
            sinon.stub(Report, 'findById').resolves(report);

            await deleteReportController(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: 'Missing required parameter - public_id' })).to.be.true;
        });

        it('should handle errors', async () => {
            sinon.stub(Report, 'findById').rejects(new Error('Error'));

            await deleteReportController(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: 'Error al eliminar el reclamo' })).to.be.true;
        });
    });
});
