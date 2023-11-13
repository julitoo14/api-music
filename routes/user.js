//importar dependencias
const express = require('express');
const check = require('../middlewares/auth');
//cargar router
const router = express.Router();
// importar controlador
const userController = require('../controllers/user');
//configuracion de subida de archivos
const multer= require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/avatars/")
    },
    filename: (req, file, cb) =>{
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});
//definir ruta
router.get('/prueba', check.auth, userController.prueba)
router.post('/register', userController.register)
router.post('/login' , userController.login)
router.get('/profile/:id', check.auth, userController.profile)
router.put('/update', check.auth, userController.update)
router.post('/upload', [check.auth, uploads.single('file0')], userController.upload)
router.get('/avatar/:file', userController.avatar)
//exportar ruta
module.exports = router;