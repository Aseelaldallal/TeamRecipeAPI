import app from '../../src/app';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { User, IUser } from '../../src/models/user';
import { Test } from '../TestInitializer';

const expect = chai.expect;
chai.use(chaiHttp);

before(async () => {
	await Test.start();
});

after(() => {
	Test.end();
});

describe('POST /new', () => {
	let adminUser: IUser;
	let jwtToken: string;

	before(async () => {
		adminUser = User.createDummy();
		const response = await chai
			.request(app)
			.post('/register')
			.type('form')
			.send(adminUser);
		jwtToken = response.body.token;
	});

	it('Should allow an authenticated user to create a new team', async () => {
		const response = await chai
			.request(app)
			.post('/team/new')
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send({ name: 'BubbleGum Team' });
		expect(response.body.name).to.equal('BubbleGum Team');
	});

	it('Should not allow an unauthenticated user to create a new team', async () => {
		const response = await chai
			.request(app)
			.post('/team/new')
			.type('form')
			.send({ name: 'BubbleGum Team' });
		expect(response.status).to.equal(401);
		expect(response.body.error).to.equal('AuthenticationError');
		expect(response.body.message).to.equal('Unauthorized');
	});
});

// CREATE
// Unauthenticated users cannot create team
// Authenticated users can create team
// Authenticated user creates team where they're admin and the rest is empty

// UPDATE
// Unauthenticated users cannot update team
// Only team admin can edit team
// New admin must be a member
// Switching admin replaces new admin, moves him to members, removes new admin from members
// Changing team members only changes team members only
// Changing
