//importar dependencias
const express = require('express');
//cargar router
const router = express.Router();
const check = require('../middlewares/auth');
// importar controlador
const albumController = require('../controllers/album');

//configuracion de subida de archivos
const multer= require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/albums/")
    },
    filename: (req, file, cb) =>{
        cb(null, "album-"+Date.now()+"-"+file.originalname);
    }
});
const uploads = multer({storage});
//definir ruta
router.get('/prueba', albumController.prueba);
router.post('/save', check.auth, albumController.save);
router.get('/one/:id',check.auth, albumController.one);
router.get('/search/:term', check.auth, albumController.search)
router.get('/list/:artistId',check.auth, albumController.list);
router.get('/randomList',check.auth, albumController.randomList);
router.put('/update/:id', check.auth, albumController.update);
router.put('/upload/:id', [check.auth, uploads.single('file0')], albumController.upload);
router.get('/image/:file', albumController.image);
router.delete('/remove/:id', check.auth, albumController.remove);
//exportar ruta
module.exports = router;