const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../index.js');

const usersController = require('../controllers/user');

beforeEach(async () => {
    usersController.cleanUpUsers();
})

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

    it('should respond with 400 status code and error message when user is duplicated', function (done) {
        this.timeout(12000);
        let user = {
            name: 'Julian',
            surname: 'Garcia Suarez',
            nick: 'Julitoo14',
            password: 'julito123',
            email: 'juuligarcia2208@gmail.com'
        }

        let user2 = {
            name: 'Milena',
            surname: 'Sabattino Placente',
            nick: 'Julitoo14',
            password: 'mile123',
            email: 'milesabattinoplacente@gmail.com'
        }
        chai.request(app)
            .post('/api/user/register')
            .send(user)
            .end((err, res) =>{
                chai.request(app)
                    .post('/api/user/register')
                    .send(user2)
                        chai.assert.equal(res.statusCode, 400);
                        chai.assert.equal(res.body.message, 'El nick o el email ya estan registrados')
                        done();
            });
    });
    
    it('should respond with 200 status code when the user is registrated', function(done){
        this.timeout(5000);
        let user = {
            name: 'Julian',
            surname: 'Garcia Suarez',
            nick: 'Julitoo14',
            password: 'julito123',
            email: 'juuligarcia2208@gmail.com'
        }
        chai.request(app)
            .post('/api/user/register')
            .send(user)
            .end((err, res) =>{
                chai.assert.equal(res.statusCode, 200);
                done();
            });
    })
})