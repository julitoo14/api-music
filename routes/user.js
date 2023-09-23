//importar dependencias
const express = require('express');
//cargar router
const router = express.Router();
// importar controlador
const userController = require('../controllers/user');
//definir ruta
router.get('/prueba', userController.prueba)
router.post('/register', userController.register)
//exportar ruta
module.exports = router;