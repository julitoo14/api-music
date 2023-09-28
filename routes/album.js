//importar dependencias
const express = require('express');
//cargar router
const router = express.Router();
const check = require('../middlewares/auth');
// importar controlador
const albumController = require('../controllers/album');
//definir ruta
router.get('/prueba', albumController.prueba);
router.post('/save', check.auth, albumController.save);
router.get('/one/:id',check.auth, albumController.one);
router.get('/list/:artistId',check.auth, albumController.list);
//exportar ruta
module.exports = router;