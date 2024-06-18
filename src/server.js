// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import router from './routers/report_routes.js';
import routerR from './routers/respuesta_routes.js'
import routerU from './routers/user_routes.js'
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload'

// Inicializaciones
const app = express()
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use( fileUpload ( { 
    useTempFiles : true , 
    tempFileDir : './uploads' 
})) ;
// Configuraciones 
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales
app.set('port',process.env.port || 3000)


// Rutas 
app.use('/api',router)
app.use('/api',routerR)
app.use('/api',routerU)
// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))


// Exportar la instancia de express por medio de app
export default  app