//conexion a db
const connection = require('./database/connection');
// dependencias
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
app.use(cors());
//convertir datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
//cargar configuracion de rutas
const UserRoutes = require('./routes/user');
const ArtistRoutes = require('./routes/artist');
const SongRoutes = require('./routes/song');
const AlbumRoutes = require('./routes/album');

app.use("/api/user",UserRoutes);
app.use("/api/album",AlbumRoutes);
app.use("/api/song",SongRoutes);
app.use("/api/artist",ArtistRoutes); 

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
//poner a escuchar peticiones http al servidor
app.listen(port, () =>{
    console.log("Node Server listening on port " + port)
})

module.exports = app;