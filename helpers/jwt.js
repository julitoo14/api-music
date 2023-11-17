const jwt = require('jwt-simple');
const moment = require('moment');

//clave
const secret = process.env.SECRET;
//crear funcion para generar tokens
const createToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        role: user.role,
        email: user.email,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(1440 , "minutes")
    };

    return jwt.encode(payload, secret);
}
//exportar modulos
module.exports = {secret, createToken};