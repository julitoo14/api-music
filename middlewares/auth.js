const jwt = require('jwt-simple');
const moment = require('moment');


//import secret key
const {secret} = require('../helpers/jwt');

//create middleware
exports.auth = (req, res, next) => {
    //check auth header
    if(!req.headers.authorization){
        return res.status(403).send({
            status: 'error',
            message: 'La peticion no tiene la cabecera de autenticacion'
        });
    }

    //cleanup token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        //decode token
        let payload = jwt.decode(token, secret);
        let utcTime = moment().utc();
        const expDate = moment(payload.exp);
        if(expDate <= moment()){
            return res.status(401).send({
                stats: 'error',
                message: 'Token expired'
            });
        }
    
        //add user data to the request
        req.user = payload;

    }catch(err){
        return res.status(404).send({
            stats: 'error',
            message: 'Token invalido',
        });
    }
    
    //go through
    next();
};

exports.authSong = (req, res, next) => {
    //check auth header
    if(!req.query.token){
        return res.status(403).send({
            status: 'error',
            message: 'La peticion no tiene la cabecera de autenticacion'
        });
    }

    //cleanup token
    let token = req.query.token.replace(/['"]+/g, '');

    try{
        //decode token
        let payload = jwt.decode(token, secret);
        let utcTime = moment().utc();
        const expDate = moment(payload.exp);
        if(expDate <= moment()){
            return res.status(401).send({
                stats: 'error',
                message: 'Token expired'
            });
        }
    
        //add user data to the request
        req.user = payload;

    }catch(err){
        return res.status(404).send({
            stats: 'error',
            message: 'Token invalido',
        });
    }
    
    //go through
    next();
};
