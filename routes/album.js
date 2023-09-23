//importar dependencias
const express = require('express');
//cargar router
const router = express.Router();
// importar controlador
const albumController = require('../controllers/album');
//definir ruta
router.get('/prueba', albumController.prueba)
//exportar ruta
module.exports = router;