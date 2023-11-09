//importar dependencias
const express = require('express');
const check = require('../middlewares/auth');
//cargar router
const router = express.Router();
// importar controlador
const playlistController = require('../controllers/playlist');
//configuracion de subida de archivos
const multer= require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/playlistCovers/")
    },
    filename: (req, file, cb) =>{
        cb(null, "playlist-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});
//definir ruta
router.post('/save', check.auth, playlistController.save)
router.post('/addSong/', check.auth, playlistController.addSong)
router.get('/songlist/:playlistId', check.auth, playlistController.songList)
router.get('/list/:userId', check.auth, playlistController.list)
router.get('/list', check.auth, playlistController.listAll)
router.delete('/removeSong/:songId', check.auth, playlistController.deleteSong)
router.delete('/remove/:playlistId', check.auth, playlistController.deletePlaylist);
//exportar ruta
module.exports = router;