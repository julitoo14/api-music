const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../index.js');

const usersController = require('../controllers/user');


describe ('Suite de pruebas de Registro de User ', () =>{
    it('should respond with 400 status code and error message when missing data', (done) =>{
        let user = {
            name: 'Julian',
            surname: 'Garcia Suarez',
            nick: 'Julitoo14'
        }
        chai.request(app)
            .post('/api/user/register')
            .send(user)
            .end((err, res) =>{
                chai.assert.equal(res.statusCode, 400);
                chai.assert.equal(res.body.message, 'Faltan datos por enviar');
                done();
            });
    });

    it('should respond with 400 status code and error message when invalid data', (done) =>{
        let user = {
            name: 'Ju',
            surname: 'Garcia Suarez',
            nick: 'Julitoo14',
            password: 'julito123',
            email: 'juuligarcia2208@gmail.com'
        }
        chai.request(app)
            .post('/api/user/register')
            .send(user)
            .end((err, res) =>{
                chai.assert.equal(res.statusCode, 400);
                chai.assert.equal(res.body.message, 'validacion no superada')

                done();
            });
    });


    it('should respond with 400 status code and error message when user is duplicated', async function () {
        await usersController.cleanUpUsers();
        this.timeout(12000);
        let user = {
            name: 'Julian',
            surname: 'Garcia Suarez',
            nick: 'julitoo14',
            password: 'julito123',
            email: 'juuligarcia2208@gmail.com'
        }

        let user2 = {
            name: 'Milena',
            surname: 'Sabattino Placente',
            nick: 'julitoo14',
            password: 'mile123',
            email: 'juuligarcia@gmail.com'
        }
        chai.request(app)
            .post('/api/user/register')
            .send(user)
            .end((err, res) =>{
                chai.request(app)
                    .post('/api/user/register')
                    .send(user2)
                    .end((err, res) =>{
                        chai.assert.equal(res.statusCode, 400);
                        chai.assert.equal(res.body.message, 'El nick o el email ya estan registrados')
                    });
            });
    });

    it('should respond with 200 status code when the user is registrated', async function(){
        await usersController.cleanUpUsers();
        this.timeout(5000);
        let user = {
            name: 'Julian',
            surname: 'Garcia Suarez',
            nick: 'Julito14',
            password: 'julito123',
            email: 'juuligarciaa2208@gmail.com'
        }
        chai.request(app)
            .post('/api/user/register')
            .send(user)
            .end((err, res) =>{
                chai.assert.equal(res.statusCode, 200);
            });
    })   
});

describe ('Suite de pruebas de Login de User', () => {
    it('should return error and message when missing data ', () =>{
        const body = {
            email: 'juuligarcia2208@gmail.com'
        }
        chai.request(app)
            .post('/api/user/login')
            .send(body)
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 400);
                chai.assert.equal(res.body.message, 'Faltan datos por enviar');
            })
    })

    it('should return error and message when email does not exist',async () =>{
        await usersController.cleanUpUsers();
        const body = {
            email: 'emailInexistente@gmail.com',
            password: '1234'
        }
        const user = {
            name: 'Julian',
            surname: 'Prueba Test',
            email: 'juuligarcia2208@gmail.com',
            password: '123456789',
            nick: 'JulitoTest'
        }
        chai.request(app)
            .post('/api/user/register')
            .send(user)
            .end((err,res) =>{
                chai.assert.equal(res.statusCode, 200);
                chai.request(app)
                    .post('/api/user/login')
                    .send(body)
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 400);
                        chai.assert.equal(res.body.message, 'El email no esta registrado');
                })
            })
        })

    it('should return an error if password is incorrect', () => {
        const user = {
            name: 'Julian',
            surname: 'Prueba Test',
            email: 'wrongPassword@gmail.com',
            password: '123456789',
            nick: 'JulitoTest'
        }
        const body = {
            email: 'wrongPassword@gmail.com',
            password: '1234567'
        }
        chai.request(app)
            .post('/api/user/register')
            .send(user)
            .end((err,res) =>{
                chai.assert.equal(res.statusCode, 200);
                chai.request(app)
                    .post('/api/user/login')
                    .send(body)
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 400);
                        chai.assert.equal(res.body.message, 'Login incorrecto');
                })
            })
    });

});

/*
describe('Suite de pruebas de Perfil de User', () =>{
    
    before(async () => {
        await usersController.cleanUpUsers()
    });

    it('should return status 200 when valid token', () =>{
        const user = {
            name: 'Julian',
            surname: 'Prueba Test',
            email: 'test@gmail.com',
            password: '123456789',
            nick: 'JulitoTest'
        }
        chai.request(app)
            .post('/api/user/register')
            .send(user)
            .end((err, res) =>{
                chai.assert.equal(res.statusCode, 200);
                chai.request(app)
                    .post('/api/user/login/')
                    .send({email: 'test@gmail.com',password: '123456789'})
                    .end((err, res) =>{
                        const token = res.body.token;
                        const id = res.body.user._id;
                        chai.assert.equal(res.statusCode, 200);
                        chai.request(app)
                            .get('/api/user/profile/' +id)
                            .set('Authorization', `${token}`)
                            .end((err, res) => {
                                chai.assert.equal(res.statusCode, 200)
                            })
                    })
        })
    })
});
*/