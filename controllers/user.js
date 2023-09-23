// dependencias
const validate = require("../helpers/validate");
const User = require('../models/user');
const bcrypt = require('bcrypt');
//prueba
const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Message sent from controllers/user.js",
  });
};

//clean up users
const cleanUpUsers = () => {
  return new Promise(async (resolve, reject) => {
      await User.deleteMany({}).exec();
      resolve();
  });
}

//registro
const register = async (req, res) => {
  // Recoger datos de la peticion
  let params = req.body;
  //comprobar q me llegan bien
  if (!params.name || !params.nick || !params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }
  //validar datos
  try {
    validate(params);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "validacion no superada",
    });
  }
  //Controlar usuarios duplicados

 try{
    let users = await User.find({
      $or: [
        {email: params.email.toLowerCase()},
        {nick: params.nick.toLowerCase()}
      ]
    }).exec();
    console.log(users);

    if (users && users.length >= 1) {
      return res.status(400).send({
        status: "error",
        message: "El nick o el email ya estan registrados"
      })
    }

    //cifrar contraseña
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    //crear objeto del usuario
    let userToSave = new User(params);

    //Guardar el usuario en la bd
    let savedUser = await userToSave.save();

    if(!savedUser){
      return res.status(500).send({
        status: 'Error',
        message: 'Error al guardar el usuario en la base de datos'
      })
    }

    // limpiar el objeto a devolver
    let userCreated = savedUser.toObject();
    delete userCreated.password;
    delete userCreated.role;

    
    return res.status(200).send({
      message: 'Accion de registro de usuarios',
      status: 'success',
      user: userCreated
    });

  }catch(err){
    console.log(err);
    return res.status(500).send({
      status: "error",
      message: "Error en la consulta de usuarios"
    });
  }
};

module.exports = { prueba, register, cleanUpUsers };
