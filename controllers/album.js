const Album = require('../models/album');
const Song = require('../models/song');
const fs = require('fs');
const path = require('path');

const prueba = (req, res) =>{
    return res.status(200).send({
      status: 'success',
      message: 'Message sent from controllers/album.js'  
    });
}

const save = async (req, res) =>{
  params = req.body;

  let album = new Album(params);
  try{
    await album.save(album);
    
    return res.status(200).send({
      status: 'success',
      message: 'Album gurdado correctamente',
      album  
    });
  }catch(err){
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }



  
  
}

const one = async (req, res) =>{
  //sacar el id del album
  const albumId = req.params.id;
  //find y popular info del artist
  try{
    const album = await Album.findById(albumId).populate({path: 'artist'}).exec();

    return res.status(200).send({
      status: 'success',
      album 
    });

  }catch(err){
    return res.status(500).send({
      status: 'error',
      message: err.message
    });
  }
  //devolver respuesta
}

const randomList = async(req, res) => {
  try{
    const albums = await Album.aggregate([{ $sample: { size: 10 } }]);
    return res.status(200).send({
      status: 'success',
      albums
    })
  }catch(err){
    return res.status(500).send({
      status: 'error',
      message: err.message
    })
  }
}

const list = async (req, res) => {
  //sacar id del artista de la url
  const artistId = req.params.artistId;
  //sacar todos los albums de la db de un artista en contreto
  if(!artistId){
    return res.status(404).send({
      status: 'error',
      message: 'no se encontro el artista'
    });
  }

  try{
    // popular info del artista 
    const albums = await Album.find({artist: artistId}).populate({path: "artist"}).sort('-year').exec()
    //devolver resultado
    return res.status(200).send({
      status: 'success',
      albums
    });

  }catch(err){
    return res.status(400).send({
      status: 'error',
      message: err.message
    });
  }
}

const search = async (req, res) => {
  const searchString = req.params.term;
  try{
    const albums = await Album.find({title: {$regex: searchString, $options: 'i'}}).exec();
    if(!albums){
      return res.status(404).send({
        status: 'error',
        message: 'No se han encontrado albums'
      })
    }

    return res.status(200).send({
      status: 'success',
      albums
    })
  }catch(err){
    return res.status(500).send({
      status: 'error',
      message: err.message
    })
  }
}

const update = async (req, res) => {
  const albumId = req.params.id;
  const data = req.body;
  try{
    const updatedAlbum = await Album.findByIdAndUpdate(albumId, data, {new:true});

    res.status(200).send({
      status: 'success',
      updatedAlbum
    })
  }catch(err){
    res.status(400).send({
      status: 'error',
      message: err.message
    })
  }

}

const image = (req, res) => {
  //sacar parametro de la url
  const file = req.params.file;
  
  if(!file){
    return res.status(404).send({
      status: 'error',
      message: 'Mising filename'
    })
  }
  //montar el path real de la imagen
  const filePath = "./uploads/albums/" + file;

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

const upload = async (req, res) =>{
  if(!req.file){
    return res.status(404).send({
      stats: 'error',
      message: "Mising file"
    });
  }

  //conseguir el nombre y el id del album a cambiar
  let image = req.file.originalname;
  const id = req.params.id;

  //sacar info de la imagen
  const imageSplit = image.split('\.');
  const extension = imageSplit[1];
  //comprobar extension
  if(extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif'){

    // borrar archivo
    if(image != 'default.png'){
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);
    }
    //devolver error
    return res.status(400).send({
      status: 'error',
      message: 'La extension no es valida',
    })
  }
  //si es correcto, guardo en la bbdd
  try{
    const album = await Album.findById(id);
    if (album.file != 'default.png') {
      const filePath = `./uploads/albums/${album.image}`;
      fs.unlinkSync(filePath);
    }

    let albumUpdated = await Album.findOneAndUpdate({_id: id}, {image: req.file.filename}, {new:true})
    
    if(!albumUpdated) {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);
      return res.status(404).send({
        status: 'error',
        message: "El album no se ha actualizado correctamente",
      })
    }

    //devolver respuesta
    return res.status(200).send({
      status: 'success',
      albumUpdated,
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

const remove = async (req, res) => {
  const id = req.params.id;
  try{
    const deletedAlbum = await Album.findByIdAndDelete(id);
    const deletedSongs = await Song.deleteMany({album: id});
    const filePath = "./uploads/albums/" + deletedAlbum.image;

    // delete the file
    if(deletedAlbum.image != 'default.png'){
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log("File deleted successfully");
    });
  }

    if(!deletedAlbum) {
      return res.status(404).send({
        status: 'error',
        message: 'No se ha eliminado el album'
      })
    }

    return res.status(200).send({
      status: 'success',
      message: 'artist has been deleted',
      deletedAlbum,
      deletedSongs
    });
  }catch(err){
    return res.status(500).send({
      status: 'error',
      message: err.message
    })
  }
};

module.exports = {
  prueba,
  save,
  one,
  list,
  update,
  upload,
  image,
  remove,
  search,
  randomList
};