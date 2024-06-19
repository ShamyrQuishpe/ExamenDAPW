/*import respuestaRModel from "../models/res_reports.js";
import {v4 as uuidv4} from "uuid"*/

import Reports_r from '../models/res_reports.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs-extra';

/*const getAllRespuestaRController = async (req, res) => {
    try{
        const respuesta_r = await respuestaRModel.getAllRespuestaRModel()
        res.status(200).json(respuesta_r)
    }catch(error){
        res.json(error)
    }
}*/

const getAllRespuestaRController = async (req,res) => {
    try {
        // Obtener todos los reportes de la base de datos
        const respuesta_r = await Reports_r.find();
    
        // Enviar una respuesta exitosa con los reportes
        res.status(200).json(respuesta_r);
      } catch (error) {
        // Manejo de errores
        res.status(500).json({ message: 'Error al cargar los reportes', error });
      }
};

/*const createRespuestaRController = async(req, res) => {
    try{
        const newRespuestaRData = {
            id:uuidv4(),
            ...req.body
        }
        //----
        const cloudinaryResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath,{folder:'reports'})
        newRespuestaRData.image =cloudinaryResponse.secure_url
        newRespuestaRData.public_id=cloudinaryResponse.public_id
        //----
        const respuesta_r = await respuestaRModel.createRespuestaRModel(newRespuestaRData)
        res.status(201).json(respuesta_r)

    }catch(error){
        console.log(error)
    }
}*/

const createRespuestaRController = async (req, res) => {
    const { direction, description, ci, state } = req.body;
  
    // Validación básica de los datos de entrada
    if (!direction || !description || !ci) {
      return res.status(400).json({ message: 'All the values are required.' });
    }
  
    try {
      // Crear un nuevo reporte
      const newRespuestaData = new Reports_r({
        direction,
        description,
        ci,
        state,
        date: new Date(),
      });

      const savedRespuesta = await newRespuestaData.save()
  
      res.status(201).json(savedRespuesta);
    } catch (error) {
      // Manejo de errores (por ejemplo, duplicado de 'direction')
      res.status(500).json({ message: 'Error creating report', error });
    }
  };

/*const getRespuestaRByIdController = async(req,res) => {
    const {id} = req.params
    try{
        const respuesta_r = await respuestaRModel.getRespuestaRByIDModel(id)
        const status = respuesta_r.error ? 404 : 200
        res.status(status).json(respuesta_r)
    }catch(error){
        res.status(501).json({msg:error})
    }
}*/

const getRespuestaRByIdController = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Buscar el reporte por su ID
      const respuesta_r = await Reports_r.findById(id);
  
      // Si el reporte no se encuentra, enviar una respuesta 404
      if (!respuesta_r) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      // Enviar una respuesta exitosa con el reporte encontrado
      res.status(200).json(respuesta_r);
    } catch (error) {
      // Manejo de errores (por ejemplo, ID no válido)
      res.status(500).json({ message: 'Error retrieving report', error });
    }
  };


/*const updateRespuestaRController = async (req, res)=>{
    const {id}= req.params
    try {
        const respuesta_r = await respuestaRModel.updateRespuestaRModel(id,req.body)
        const status = respuesta_r.error ? 404 :200
        res.status(status).json(respuesta_r)
    } catch (error) {
        res.status(500).json({mgs:error})
    }
}*/

const updateRespuestaRController = async (req, res) => {
    const { direction, description, ci, state } = req.body;
    const { id } = req.params;

    const updatedRespuestaR = {
        direction,
        description,
        ci,
        state,
    };

    try {
        const respuesta_r = await Reports_r.findByIdAndUpdate(id, updatedRespuestaR, { new: true });

        if (!respuesta_r) {
            return res.status(404).json({ error: 'Report no encontrado' });
        }

        res.status(200).json(respuesta_r);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el reporte' });
    }
};

/*const deleteRespuestaRController = async (req, res)=>{
    const {id}= req.params
    try {
        const respuesta = await respuestaRModel.deleteRespuestaRModel(id)
        const status = respuesta.error ? 404 :200
        res.status(status).json(respuesta)
    } catch (error) {
        res.status(500).json({mgs:error})
    }
}*/

const deleteRespuestaRController = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el reclamo por el ID para obtener el public_id
        const respuesta_r = await Reports_r.findById(id);

        if (!respuesta_r) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }

        // Eliminar el reclamo de la base de datos
        await Reports_r.findByIdAndDelete(id);

        res.status(200).json({ message: 'Reporte eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el reclamo' });
    }
};

export{
    getAllRespuestaRController, 
    createRespuestaRController, 
    getRespuestaRByIdController, 
    updateRespuestaRController, 
    deleteRespuestaRController
}