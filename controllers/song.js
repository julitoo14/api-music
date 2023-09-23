const prueba = (req, res) =>{
    return res.status(200).send({
      status: 'success',
      message: 'Message sent from controllers/song.js'  
    });
}

module.exports = {prueba};