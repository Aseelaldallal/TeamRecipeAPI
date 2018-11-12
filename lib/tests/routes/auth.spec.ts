import * as mocha from 'mocha';
import app from '../../src/app';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { User } from '../../src/models/user';

const expect = chai.expect;
chai.use(chaiHttp);

const newUser = {
	email: 'testuser@gmail.com',
	password: 'password',
	username: 'username',
	firstname: 'firstname',
	lastname: 'lastname',
	address: 'address'
};

describe('POST /register', () => {
	it('Missing required fields results in 400 Bad Request', async () => {
		const email = newUser.email;
		const password = newUser.password;
		const response = await chai
			.request(app)
			.post('/register')
			.type('form')
			.send({ email, password });
		expect(response.status).to.equal(400);
		expect(response.error.text).to.equal('Bad Request');
	});

	it('Creates a user and returns a token', async () => {
		const response = await chai
			.request(app)
			.post('/register')
			.type('form')
			.send(newUser);
		expect(response.status).to.equal(200);
		expect(response.body).includes.all.keys(['token', 'expiry']);
	});

	it('Does not create a new user because the user already exists', async () => {
		const response = await chai
			.request(app)
			.post('/register')
			.type('form')
			.send(newUser);
		expect(response.status).to.equal(209);
		expect(response.body).includes.all.keys(['error', 'message']);
		expect(response.body.error).to.equal('UserExists');
	});
});

describe('POST /login', () => {
	it('Missing Password Returns 400 - Bad Request', async () => {
		const email = 'testuser@gmail.com';
		const response = await chai
			.request(app)
			.post('/login')
			.type('form')
			.send({ email });
		expect(response.status).to.equal(400);
		expect(response.error.text).to.equal('Bad Request');
	});

	it('Missing Email Returns 400 - Bad Request', async () => {
		const password = 'password';
		const response = await chai
			.request(app)
			.post('/login')
			.type('form')
			.send({ password });
		expect(response.status).to.equal(400);
		expect(response.error.text).to.equal('Bad Request');
	});

	it('Malformed Email Returns 400 - Bad Request', async () => {
		const email = 'abcdefg';
		const password = 'password';
		const response = await chai
			.request(app)
			.post('/login')
			.type('form')
			.send({ email, password });
		expect(response.status).to.equal(400);
		expect(response.error.text).to.equal('Bad Request');
	});

	it('Non Existant Username Retuns 401 - Invalid Credentials', async () => {
		const email = `${Math.random()}@gmail.com`;
		const password = newUser.password;
		const response = await chai
			.request(app)
			.post('/login')
			.type('form')
			.send({ email, password });
		expect(response.status).to.equal(401);
		expect(response.body.error).to.equal('InvalidCredentials');
	});

	it('Wrong password returns 401 - Invalid Credentials', async () => {
		const email = newUser.email;
		const password = '1223333';
		const response = await chai
			.request(app)
			.post('/login')
			.type('form')
			.send({ email, password });
		expect(response.status).to.equal(401);
		expect(response.body.error).to.equal('InvalidCredentials');
	});

	it('Successfully logs in - returns a token and expiry', async () => {
		const email = newUser.email;
		const password = newUser.password;
		const response = await chai
			.request(app)
			.post('/login')
			.type('form')
			.send({ email, password });
		expect(response.status).to.equal(200);
		expect(response.body).includes.all.keys(['token', 'expiry']);
	});
});

after(async () => {
	await User.remove({ email: newUser.email });
});
