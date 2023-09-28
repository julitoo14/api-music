const Album = require('../models/album');

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
    const albums = await Album.find({artist: artistId}).populate({path: "artist"}).exec()
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

const update = (req, res) => {
  
}

module.exports = {
  prueba,
  save,
  one,
  list
};