//importar dependencias
const express = require('express');

//cargar router
const router = express.Router();
const check = require('../middlewares/auth');
// importar controlador
const songController = require('../controllers/song');

//configuracion de subida de archivos
const multer= require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/songs/")
    },
    filename: (req, file, cb) =>{
        cb(null, "song-"+Date.now()+"-"+file.originalname);
    }
});
const uploads = multer({storage});
//definir ruta
router.get('/prueba', songController.prueba);
router.post('/save', check.auth, songController.save);
router.get('/one/:id', check.auth, songController.one);
router.get('/listByAlbum/:albumId', check.auth, songController.listByAlbum);
router.put('/update/:id', check.auth, songController.update);
router.delete('/remove/:id', check.auth, songController.remove);
router.put('/upload/:id', [check.auth, uploads.single('file0')], songController.upload);
router.get('/file/:file', check.auth, songController.file);
//exportar ruta
module.exports = router;