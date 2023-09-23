//importar dependencias
const express = require('express');
//cargar router
const router = express.Router();
// importar controlador
const songController = require('../controllers/song');
//definir ruta
router.get('/prueba', songController.prueba)
//exportar ruta
module.exports = router;