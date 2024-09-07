//conexion a db
require('dotenv').config();
const connection = require('./database/connection');
// dependencias
const path = require('path');
const express = require('express');
const cors = require('cors');
//welcome message
console.log('API REST con NodeJs para app tipo Spotify')
//conectar db
connection();
//crear servidor node
const app = express();
const port = 3910;
//configurar cors
app.use(cors({
    origin: 'https://juliangarciasuarez.tech', // Permite solicitudes desde tu dominio
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
//convertir datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
//cargar configuracion de rutas
const UserRoutes = require('./routes/user');
const ArtistRoutes = require('./routes/artist');
const SongRoutes = require('./routes/song');
const AlbumRoutes = require('./routes/album');
const PlaylistRoutes = require('./routes/playlist');

app.use("/api/user",UserRoutes);
app.use("/api/album",AlbumRoutes);
app.use("/api/song",SongRoutes);
app.use("/api/artist",ArtistRoutes); 
app.use("/api/playlist", PlaylistRoutes);
app.use(express.static(path.join(__dirname, 'dist')));

//ruta de pruebas
app.get("/ruta-probando", (req, res) =>{

    return res.status(200).send([{
        'id': 12,
        'nombre': 'julian',
        'apellido': 'Garcia' 
    },
    {
        'id': 13,
        'nombre': 'Milena',
        'apellido': 'Sabattino'
    }
    ]);

})

// Redirige cualquier solicitud que no coincida con una ruta estática al index.html.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
//poner a escuchar peticiones http al servidor
app.listen(port,'0.0.0.0', () =>{
    console.log("Node Server listening on port " + port)
})

module.exports = app;
