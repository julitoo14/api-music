const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

const prueba = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Message sent from controllers/artist.js",
  });
};

const save = async (req, res) => {
  //Recoger datos del body
  let params = req.body;
  //Crear el artista
  let artist = new Artist(params);
  //Guardarlo
  try {
    const artistStored = await artist.save();
    return res.status(200).send({
      status: "success",
      message: "Se ha guardado el artista",
      artist: artistStored,
    });
  } catch (err) {
    return res.status(400).send({
      status: "error",
      message: err.message,
    });
  }
};

const one = async (req, res) => {
  //sacar param por url
  const id = req.params.id;

  //Find
  try {
    const artist = await Artist.findById(id);

    return res.status(200).send({
      status: "success",
      message: "Accion de sacar un artista",
      artist,
    });
  } catch (err) {
    return res.status(400).send({
      status: "error",
      message: err.message,
    });
  }
};

const list = async (req, res) => {
  // sacar la pag
  let page = 1;

  if (req.params.page) {
    page = req.params.page;
  }
  //definir elementos por pagina
  const itemsPerPage = 8;
  //find, ordernar y paginar
  try {
    const total = await Artist.countDocuments();
    const artists = await Artist.find()
      .sort("name")
      .paginate(page, itemsPerPage);
    return res.status(200).send({
      status: "success",
      message: "Listado artistas",
      page,
      total,
      artists,
    });
  } catch (error) {
    return res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  //recoger id
  const id = req.params.id;
  // recoger datos body
  const data = req.body;
  //buscar y actualizar artista
  try {
    const artistUpdated = await Artist.findByIdAndUpdate(id, data, {
      new: true,
    });

    return res.status(200).send({
      status: "success",
      message: "Update artist",
      artistUpdated,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  //recoger id
  const id = req.params.id;
  try {
    const artistDeleted = await Artist.findByIdAndDelete(id);
    const albumDeleted = await Album.deleteMany({ artist: id });
    // Y si hay muchos albums??
    const songDeleted = await Song.deleteMany({ album: albumDeleted._id });
    const filePath = "./uploads/artists/" + artistDeleted.image;

    // delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log("File deleted successfully");
    });
    return res.status(200).send({
      status: "success",
      message: "artist has been deleted",
      artistDeleted,
      albumDeleted,
      songDeleted,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

const image = (req, res) => {
  //sacar parametro de la url
  const file = req.params.file;

  if (!file) {
    return res.status(404).send({
      status: "error",
      message: "Mising filename",
    });
  }
  //montar el path real de la imagen
  const filePath = "./uploads/artists/" + file;

  //comprobar que existe el fichero
  fs.stat(filePath, (err, exists) => {
    if (err || !exists) {
      return res.status(404).send({
        status: "error",
        message: "la imagen no existe",
      });
    }

    //devolver el fichero
    return res.sendFile(path.resolve(filePath));
  });
};

const upload = async (req, res) => {
  if (!req.file) {
    return res.status(404).send({
      stats: "error",
      message: "Mising file",
    });
  }

  //conseguir el nombre y el id del artista a cambiar
  let image = req.file.originalname;
  const id = req.params.id;

  //sacar info de la imagen
  const imageSplit = image.split(".");
  const extension = imageSplit[1];
  //comprobar extension
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // borrar archivo
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);
    //devolver error
    return res.status(400).send({
      status: "error",
      message: "La extension no es valida",
    });
  }
  //si es correcto, guardo en la bbdd
  try {
    let artistUpdated = await Artist.findOneAndUpdate(
      { _id: id },
      { image: req.file.filename },
      { new: true }
    );

    if (!artistUpdated) {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);
      return res.status(404).send({
        status: "error",
        message: "El artista no se ha actualizado correctamente",
      });
    }

    //devolver respuesta
    return res.status(200).send({
      status: "success",
      artist: artistUpdated,
      file: req.file,
    });
  } catch (err) {
    const filePath = req.file.path;
    fs.unlinkSync(filePath);
    return res.status(500).send({
      status: "error",
      message: "Error en la subida de imagen " + err,
    });
  }
};

module.exports = {
  prueba,
  save,
  one,
  list,
  update,
  remove,
  upload,
  image,
};
