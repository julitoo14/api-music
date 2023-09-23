const mongoose = require('mongoose');
var databaseName = 'Spotify';
if(process.env.NODE_ENV === 'test'){
    databaseName = 'testdb'
}
const password = 'julito123';

const connection = async() =>{
    try{
        await mongoose.connect(`mongodb+srv://juuligarcia2208:${password}@spotify.6ckpon2.mongodb.net/?retryWrites=true&w=majority`,
        {dbName: databaseName});
        console.log('Connected to Database ' + databaseName);
    }catch(error){
        console.log(error);
        throw new Error("No se ha establecido la conexion a la base de datos");
    }
}

module.exports = connection;