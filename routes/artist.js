//importar dependencias
const express = require('express');
//cargar router
const router = express.Router();
// importar controlador
const artistController = require('../controllers/artist');
//definir ruta
router.get('/prueba', artistController.prueba)
//exportar ruta
module.exports = router;