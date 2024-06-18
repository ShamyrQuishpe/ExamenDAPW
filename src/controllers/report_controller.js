/*import reportModel from "../models/reports.js";
import {v4 as uuidv4} from "uuid"*/

import Report from '../models/reports.js'
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs-extra';

/*const getAllReportsController = async (req, res) => {
    try{
        const reports = await reportModel.getAllReportsModel()
        res.status(200).json(reports)
    }catch(error){
        res.json(error)
    }
}*/

const getAllReportsController = async (req, res) => {
    try {
      // Obtener todos los reportes de la base de datos
      const reports = await Report.find();
  
      // Enviar una respuesta exitosa con los reportes
      res.status(200).json(reports);
    } catch (error) {
      // Manejo de errores
      res.status(500).json({ message: 'Error al cargar los reportes', error });
    }
  };

/*const createReportsController = async(req, res) => {
    try{
        const newReportData = {
            id:uuidv4(),
            ...req.body
        }
        //----
        const cloudinaryResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath,{folder:'reports'})
        newReportData.image =cloudinaryResponse.secure_url
        newReportData.public_id=cloudinaryResponse.public_id
        //----
        const report = await reportModel.createReportModel(newReportData)
        res.status(201).json(report)

    }catch(error){
        console.log(error)
    }
}*/

const createReportsController = async (req, res) => {
    const { direction, description } = req.body;
  
    // Validación básica de los datos de entrada
    if (!direction || !description) {
      return res.status(400).json({ message: 'Direction and case are required.' });
    }
  
    try {
      // Crear un nuevo reporte
      const newReportData = new Report({
        direction,
        description,
        date: new Date(),
      });

      const cloudinaryResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath,{folder:'Reports'});
      newReportData.image = cloudinaryResponse.secure_url;
      newReportData.public_id = cloudinaryResponse.public_id
      console.log("hoals")
      // Guardar el reporte en la base de datos
      //const savedReport = await newReport.save();
      const report = new Report(newReportData)
      await report.save()

      await fs.unlink(req.files.image.tempFilePath)
      console.log("hola")
      // Enviar una respuesta exitosa
      res.status(201).json(report);
    } catch (error) {
      // Manejo de errores (por ejemplo, duplicado de 'direction')
      res.status(500).json({ message: 'Error creating report', error });
    }
  };
  

/*const getReportByIdController = async(req,res) => {
    const {id} = req.params
    try{
        const report = await reportModel.getReportByIDModel(id)
        const status = report.error ? 404 : 200
        res.status(status).json(report)
    }catch(error){
        res.status(501).json({msg:error})
    }
}*/

const getReportByIdController = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Buscar el reporte por su ID
      const report = await Report.findById(id);
  
      // Si el reporte no se encuentra, enviar una respuesta 404
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      // Enviar una respuesta exitosa con el reporte encontrado
      res.status(200).json(report);
    } catch (error) {
      // Manejo de errores (por ejemplo, ID no válido)
      res.status(500).json({ message: 'Error retrieving report', error });
    }
  };

/*const updateReportController = async (req, res)=>{
    const {id}= req.params
    try {
        const report = await reportModel.updateReportController(id,req.body)
        const status = report.error ? 404 :200
        res.status(status).json(report)
    } catch (error) {
        res.status(500).json({mgs:error})
    }
}*/

/*const updateReportController = async (req, res) => {
    const { id } = req.params;
    const { direction, case: caseDescription, date } = req.body;
  
    try {
      // Buscar y actualizar el reporte existente
      const updatedReport = await Report.findByIdAndUpdate(
        id,
        {
          direction,
          case: caseDescription,
          date,
        },
        { new: true, runValidators: true }
      );
  
      // Si el reporte no se encuentra, enviar una respuesta 404
      if (!updatedReport) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      // Enviar una respuesta exitosa con el reporte actualizado
      res.status(200).json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: 'Error updating report', error });
    }
  };*/

  const updateReportController = async (req, res) => {
    const { direction, description } = req.body;
    const { id } = req.params;

    const updatedReport = {
        direction,
        description,
    };

    try {
        if (req.files && req.files.image) {
            const cloudinaryResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath, { folder: 'Reports' });
            updatedReport.image = cloudinaryResponse.secure_url;
            await fs.unlink(req.files.image.tempFilePath);
        }

        const report = await Report.findByIdAndUpdate(id, updatedReport, { new: true });

        if (!report) {
            return res.status(404).json({ error: 'Report no encontrado' });
        }

        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el reporte' });
    }
};
/*const deleteReportController = async (req, res)=>{
    const {id}= req.params
    try {
        const report = await reportModel.deleteReportController(id)
        const status = report.error ? 404 :200
        res.status(status).json(report)
    } catch (error) {
        res.status(500).json({mgs:error})
    }
}*/

/*const deleteReportController = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Eliminar el reporte por su ID
      const deletedReport = await Report.findByIdAndDelete(id);
  
      // Si el reporte no se encuentra, enviar una respuesta 404
      if (!deletedReport) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      // Enviar una respuesta exitosa indicando que el reporte fue eliminado
      res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
      // Manejo de errores
      res.status(500).json({ message: 'Error deleting report', error });
    }
  };*/

  const deleteReportController = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el reclamo por el ID para obtener el public_id
        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ error: 'Reporte no encontrado' });
        }

        // Verificar si existe public_id en el reclamo
        if (!report.public_id) {
            return res.status(400).json({ error: 'Missing required parameter - public_id' });
        }

        // Eliminar la imagen de Cloudinary utilizando el public_id
        await cloudinary.uploader.destroy(report.public_id);

        // Eliminar el reclamo de la base de datos
        await Report.findByIdAndDelete(id);

        res.json({ message: 'Reporte eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el reclamo' });
    }
};


export{
    getAllReportsController, 
    createReportsController, 
    getReportByIdController, 
    updateReportController, 
    deleteReportController
}