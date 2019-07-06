import app from '../../src/app';
import * as decode from 'jwt-decode';
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
	let adminId: string;
	let jwtToken: string;

	before(async () => {
		const adminUser = User.createDummy();
		const response = await chai
			.request(app)
			.post('/register')
			.type('form')
			.send(adminUser);
		jwtToken = response.body.token;
		adminId = (decode(jwtToken) as any).id;
	});

	it('Should allow an authenticated user to create a new team', async () => {
		const response = await chai
			.request(app)
			.post('/team/new')
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send({ name: 'BubbleGum Team' });
		expect(response.body.team).to.not.be.null;
		expect(response.body.team.name).to.equal('BubbleGum Team');
	});

	it('Should not allow the creation of a team without a name', async () => {
		const response = await chai
			.request(app)
			.post('/team/new')
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send();
		expect(response.status).to.equal(400);
		expect(response.body.error.name).to.equal('BadRequest');
		expect(response.body.error.type).to.equal('ValidationError');
		expect(response.body.error.message).to.have.length(1);
		expect(response.body.error.message[0]).to.equal('name is required');
	});

	it('Should set the team name', async () => {
		const response = await chai
			.request(app)
			.post('/team/new')
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send({ name: 'Little Ducks' });
		expect(response.body.team).to.not.be.null;
		expect(response.body.team.name).to.equal('Little Ducks');
	});

	it('Should set the team admin to authenticated user', async () => {
		const response = await chai
			.request(app)
			.post('/team/new')
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send({ name: 'Little Ducks' });
		expect(response.body.team).to.not.be.null;
		expect(response.body.team.admin).to.include({
			id: adminId
		});
	});

	it('Should not allow an unauthenticated user to create a new team', async () => {
		const response = await chai
			.request(app)
			.post('/team/new')
			.type('form')
			.send({ name: 'BubbleGum Team' });
		expect(response.status).to.equal(401);
		expect(response.body.error).to.not.be.null;
		expect(response.body.error.type).to.equal('AuthenticationError');
		expect(response.body.error.name).to.equal('Unauthorized');
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
