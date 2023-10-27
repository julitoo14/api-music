const Song = require('../models/song');
const fs = require('fs');
const path = require('path');

const prueba = (req, res) =>{
    return res.status(200).send({
      status: 'success',
      message: 'Message sent from controllers/song.js'  
    });
}

const save = async (req, res) =>{

  const params = req.body;
  const song = new Song(params);

try{
  const savedSong = await song.save(req, res);

  if(!savedSong){
    return res.status(404).send({
      status: 'error',
      message:" No se ha guardado la cancion"
    })
  }

  //configurar subida de cancion

  return res.status(200).send({
    status: 'success',
    message: 'Se ha guardado la cancion',
    savedSong
  })

}catch(err){
  return res.status(404).send({
    status: 'error',
    message: err.message
  })
}
}

const one = async (req, res) => {
  const id = req.params.id;
  try{
    const song = await Song.findById(id).populate("album").exec();
    if (!song){
      return res.status(404).send({
        status: 'error',
        message: 'No se ha encontrado la cancion'
      })
    }

    return res.status(200).send({
      status: 'success',
      song
    })
  }catch(err){
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
}

const listByAlbum = async (req, res) => {
  const albumId = req.params.albumId;
  try{
    const songs = await Song.find({album: albumId}).sort('track').exec();

    return res.status(200).send({
      status: 'success',
      songs
    });

  }catch(err){
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
}

const update = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try{
    const updatedSong = await Song.findByIdAndUpdate(id, data, {new: true});
    
    if(!updatedSong){
      return res.status(404).send({
        status: 'error',
        message: 'No se ha actualizado la cancion'
      });
    }

    return res.status(200).send({
      status: 'success',
      updatedSong
    });
  }catch(err){
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
}

const remove = async (req, res) =>{
  const id = req.params.id;
  try{
    removedSong = await Song.findByIdAndDelete(id).exec();
    const filePath = "./uploads/songs/" + removedSong.file;
    // delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`File ${removedSong.file} deleted successfully`);
    });

    if(!removedSong){
      return res.status(404).send({
        status: 'error',
        message: 'Error al borrar la cancion'
      })
    }

    return res.status(200).send({
      status: 'success',
      removedSong
    })
  }catch(err){
    return res.status(500).send({
      status: 'error',
      message: err.message
    })
  }
}

const file = (req, res) => {
  //sacar parametro de la url
  const file = req.params.file;
  
  if(!file){
    return res.status(404).send({
      status: 'error',
      message: 'Mising filename'
    })
  }
  //montar el path real de la imagen
  const filePath = "./uploads/songs/" + file;

  //comprobar que existe el fichero
  fs.stat(filePath, (err, exists) => {
    if(err || !exists){
      return res.status(404).send({
        status: 'error',
        message: 'la cancion no existe'
      })
    }

    //devolver el fichero
    return res.sendFile(path.resolve(filePath));
  })



}

const upload = async (req, res) =>{
  if(!req.file){
    return res.status(404).send({
      stats: 'error',
      message: "Mising file"
    });
  }

  //conseguir el nombre y el id del album a cambiar
  let song = req.file.originalname;
  const id = req.params.id;

  //sacar info de la imagen
  const songSplit = song.split('\.');
  const extension = songSplit[1];
  //comprobar extension
  if(extension != 'mp3'){

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
    let songUpdated = await Song.findOneAndUpdate({_id: id}, {file: req.file.filename}, {new:true})
    
    if(!songUpdated) {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);
      return res.status(404).send({
        status: 'error',
        message: "La cancion no se ha actualizado correctamente",
      })
    }

    //devolver respuesta
    return res.status(200).send({
      status: 'success',
      songUpdated,
      file: req.file
    })
  }catch(err){
    const filePath = req.file.path;
    fs.unlinkSync(filePath);
    return res.status(500).send({
      status: 'error',
      message: 'Error en la subida de imagen ' + err,
    });

  }
}

module.exports = {
  prueba,
  save,
  one,
  listByAlbum,
  update,
  remove,
  file,
  upload
};