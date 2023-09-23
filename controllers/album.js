const prueba = (req, res) =>{
    return res.status(200).send({
      status: 'success',
      message: 'Message sent from controllers/album.js'  
    });
}

module.exports = {prueba};