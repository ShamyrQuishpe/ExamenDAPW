/*import {v4 as uuidv4} from 'uuid'

import userModel from "../models/user.js"
import bcrypt from "bcrypt"
import { createToken } from '../middlewares/auth.js'

const registerUserController = async (req,res)=>{
    //punto 1
    const {password,...otherDataUser} = req.body
    const hashedPassword = await bcrypt.hash(password,10) 
    const newUserData ={ 
        id:uuidv4(),
        password:hashedPassword,
        ...otherDataUser
    }
    //punto 2
    const user = await userModel.registerUserModel(newUserData)
        
    //punto 3
    res.status(201).json(user)
}

const loginUserController= async (req,res)=>{
    const {username,password} = req.body
    try {
        const user = await userModel.loginUserModel(username,password)
            //CREACION DEL TOKEN
            const token = createToken(user)
            //FIN DE LA CREACION DEL TOKEN
        res.status(200).json({user,token})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

export {
    registerUserController,
    loginUserController
}*/

// controllers/userController.js
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { createToken } from '../middlewares/auth.js';

const registerUserController = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    let user = await User.findOne({ email });
    
    if (user) {
        return res.status(400).json({ error: "Email ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(200).json({ success: "Usuario registrado con éxito", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error en el registro del email" });
  }
};

const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Username o password invalido" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = createToken({
        id: user._id,
        email: user.email,
      })
      res.status(200).json({ success: "Login exitoso", user, token });
    } else {
      res.status(400).json({ error: "Username o password invalido" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error en el login" });
  }
};

export {
    registerUserController,
    loginUserController
}