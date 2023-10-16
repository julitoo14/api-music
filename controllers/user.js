// dependencias
const validate = require("../helpers/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { param } = require("../routes/song");
//prueba
const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Message sent from controllers/user.js",
    user: req.user,
  });
};

//clean up users
const cleanUpUsers = async () => {
  await User.deleteMany({}).exec();
}

//registro
const register = async (req, res) => {
  // Recoger datos de la peticion
  let params = req.body;
  //comprobar q me llegan bien
  if (!params.name || !params.nick || !params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "missing required parameters",
    });
  }
  //validar datos
  try {
    validate(params);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "validation didn't pass",
    });
  }
  //Controlar usuarios duplicados

  try {
    let users = await User.find({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    }).exec();

    if (users && users.length >= 1) {
      return res.status(400).send({
        status: "error",
        message: "These nick or email are already registered",
      });
    }

    //cifrar contraseña
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    //crear objeto del usuario
    let userToSave = new User(params);

    //Guardar el usuario en la bd
    let savedUser = await userToSave.save();

    if (!savedUser) {
      return res.status(500).send({
        status: "Error",
        message: "Failed to save user into database",
      });
    }

    // limpiar el objeto a devolver
    let userCreated = savedUser.toObject();
    delete userCreated.password;
    delete userCreated.role;

    return res.status(200).send({
      message: "User " + params.nick + " has been registered successfully. You will be redirected to Home page in 5 seconds",
      status: "success",
      user: userCreated,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: "error",
      message: err.message,
    });
  }
}

const login = async (req, res) => {
  // recibir parametros de peticion
  const params = req.body;
  //comprobar que me llegan
  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }
  //Buscar en la bd si existe el email
  let user = await User.findOne({ email: params.email })
    .select("+password +role")
    .exec();

  if (!user) {
    return res.status(400).send({
      status: "error",
      message: "Email isn't registered",
    });
  }

  //comprobar su contraseña
  const pwd = bcrypt.compareSync(params.password, user.password);
  if (!pwd) {
    return res.status(400).send({
      status: "error",
      message: "Wrong credentials",
    });
  }

  //limpiar objeto
  identityUser = user.toObject();
  delete identityUser.password;

  //conseguir token jwt
  const token = jwt.createToken(user);

  //Devolver datos de usuario y token
  return res.status(200).send({
    message: "User logged succesfully, Welcome " + user.name+"!",
    status: "success",
    user: identityUser,
    token,
  });
}

const signOut = async (req, res) => {
  
}

const profile = async (req, res) => {
  //recoger id usuario de la url
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      status: "error",
      message: 'El ID proporcionado no es válido'
    });
  }

try{
  const user = await User.findById(id);
  
    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado el usuario",
      });
    }
  
    //devolver datos de usuario
    return res.status(200).send({
      status: "success",
      id,
      user,
    });
  }catch (error){
    console.error(error);
    return res.status(500).send({
      status: "error",
      message: "error en el servidor"
    })
  }
}

const update = async (req, res) => {
  //recoger datos usuario identificado
  let userIdentity = req.user; //saco los datos del payload del token
  //recoger datos a actualizar
  let userToUpdate = req.body;
  //comprobar si el usuario existe
  try{
    let users = await User.find({
      $or: [
        {email: userToUpdate.email.toLowerCase()},
        {nick: userToUpdate.nick.toLowerCase()}
      ]
    }).exec()

    //comprobar si usuario existe y no soy yo(el identificado)
    // si el mail o el nick ya estan en uso se configura isSet como true
    let userIsSet = false;
    users.forEach(user => {
      if(user && user._id != userIdentity.id){
        userIsSet = true;
      }
    })
    //si ya existe devuelvo respuesta
    if(userIsSet){
      return res.status(400).send({
        status: 'error',
        message: 'El usuario ya existe'
      });
    }

    //cifrar password si me llega
    if(userToUpdate.password){
      let pwd = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = pwd;
    }else{
      delete userToUpdate.password;
    }

    //buscar usuario en bd y actualizar datos
    try{
      let userUpdated = await User.findByIdAndUpdate({_id: userIdentity.id}, userToUpdate, {new: true});
      
      if(!userUpdated){
        return res.status(400).send({
          status: 'error',
          message: 'Error al actualizar'
        });
      }

      //devolver respuesta
      return res.status(200).send({
        status: 'Success',
        message: 'User updated',
        user: userUpdated
      });

    }catch(err){
      return res.status(500).send({
        status: 'error',
        message: 'Error al actualizar'
      });
    }

    //devolver respuesta

  }catch(error){
    return res.status(500).send({
      status: 'error',
      message: 'Error en la consulta de usuarios'
    })
  }
  
  
}

const upload = async (req, res) => {
  //configurar la subida con multer
  //recoger fichero de imagen y comprobar si existe
  if(!req.file){
    return res.status(404).send({
      status: 'error',
      message: 'Missing file'
    })
  }
  //conseguir el nombre
  let image = req.file.originalname;

  //sacar info de la imagen
  const imageSplit = image.split('\.');
  const extension = imageSplit[1];
  //comprobar extension
  if(extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif'){

    // borrar archivo
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);
    //devolver error
    return res.status(400).send({
      status: 'error',
      message: 'La extension no es valida',
    })

  }
  //si es correcto, guardo en la bbdd
  try{
    let userUpdated = await User.findOneAndUpdate({_id: req.user.id}, {image: req.file.filename}, {new:true})
    
    if(!userUpdated) {
      const filePath = req.file.path;
      const fileDeleted = fs.unlinkSync(filePath);
      return res.status(404).send({
        status: 'error',
        message: "El usuario no se ha actualizado correctamente"
      })
    }

    //devolver respuesta
    return res.status(200).send({
      status: 'success',
      user: userUpdated,
      file: req.file
    })
  }catch(err){
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);
    return res.status(500).send({
      status: 'error',
      message: 'Error en la subida de imagen ' + err,
    })

  }

}

const avatar = (req, res) => {
  //sacar parametro de la url
  const file = req.params.file;
  
  if(!file){
    return res.status(404).send({
      status: 'error',
      message: 'Mising filename'
    })
  }
  //montar el path real de la imagen
  const filePath = "./uploads/avatars/" + file;

  //comprobar que existe el fichero
  fs.stat(filePath, (err, exists) => {
    if(err || !exists){
      return res.status(404).send({
        status: 'error',
        message: 'la imagen no existe'
      })
    }

    //devolver el fichero
    return res.sendFile(path.resolve(filePath));
  })



}

module.exports = {
  avatar,
  prueba,
  register,
  cleanUpUsers,
  login,
  profile,
  update,
  upload 
};
