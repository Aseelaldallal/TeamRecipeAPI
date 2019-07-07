import app from '../../src/app';
import * as decode from 'jwt-decode';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { User, IUser, IUserDocument } from '../../src/models/user';
import { Test } from '../TestInitializer';
import { Team, ITeamDocument } from '../../src/models/team';

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

	it('Should not allow an unauthenticated user to create a new team', async () => {
		const response = await chai
			.request(app)
			.post('/team/new')
			.type('form')
			.send({ name: 'BubbleGum Team' });
		expect(response.status).to.equal(401);
		expect(response.body.error).to.be.an('object').that.is.not.empty;
		expect(response.body.error.type).to.equal('AuthenticationError');
		expect(response.body.error.name).to.equal('Unauthorized');
	});

	it('Should not allow the creation of a team without a name', async () => {
		const response = await chai
			.request(app)
			.post('/team/new')
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send();
		expect(response.status).to.equal(400);
		expect(response.body.error).to.be.an('object').that.is.not.empty;
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
		expect(response.body.team).to.be.an('object').that.is.not.empty;
		expect(response.body.team.name).to.equal('Little Ducks');
	});

	it('Should set the team admin to authenticated user', async () => {
		const response = await chai
			.request(app)
			.post('/team/new')
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send({ name: 'Little Ducks' });
		expect(response.body.team).to.be.an('object').that.is.not.empty;
		expect(response.body.team.admin).to.include({
			id: adminId
		});
	});
});

describe('PATCH /:teamId/updateAdmin', () => {
	let jwtToken: string;
	let team: ITeamDocument;
	let admin: IUserDocument;
	let memberA: IUserDocument;
	let memberB: IUserDocument;

	before(async () => {
		// Create Team Members
		admin = await new User(User.createDummy()).save();
		memberA = await new User(User.createDummy()).save();
		memberB = await new User(User.createDummy()).save();
		// Login Admin to get token
		const response = await chai
			.request(app)
			.post('/login')
			.type('form')
			.send({
				email: admin.email,
				password: 'password'
			});
		jwtToken = response.body.token;
		// Create Team
		team = await new Team({
			name: 'Team',
			admin: {
				id: admin.id,
				username: admin.username
			},
			members: [
				{ id: memberA.id, username: memberA.username },
				{ id: memberB.id, username: memberB.username }
			],
			recipes: []
		}).save();
	});

	it('Should not allow an unauthenticated user to update Admin', async () => {
		const response = await chai
			.request(app)
			.patch(`/team/${team.id}/updateAdmin`)
			.type('form')
			.send();
		expect(response.status).to.equal(401);
		expect(response.body.error).to.be.an('object').that.is.not.empty;
		expect(response.body.error.type).to.equal('AuthenticationError');
		expect(response.body.error.name).to.equal('Unauthorized');
	});

	it('Should return an error if body is missing newAdminId', async () => {
		const response = await chai
			.request(app)
			.patch(`/team/${team.id}/updateAdmin`)
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send();
		expect(response.status).to.equal(400);
		expect(response.body.error.name).to.equal('BadRequest');
		expect(response.body.error.type).to.equal('ValidationError');
		expect(response.body.error.message).to.have.length(1);
		expect(response.body.error.message[0]).to.equal('newAdminId is required');
	});

	it('Should return BadRequest if teamId is an invalid objectID', async () => {
		const response = await chai
			.request(app)
			.patch(`/team/5d214138/updateAdmin`)
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send({ newAdminId: memberA.id });
		expect(response.status).to.equal(400);
		expect(response.body.error).to.be.an('object').that.is.not.empty;
		expect(response.body.error.name).to.equal('BadRequest');
		expect(response.body.error.type).to.equal('ValidationError');
	});

	it('Should return BadRequest if team does not exist', async () => {
		const response = await chai
			.request(app)
			.patch(`/team/5d2141d9ded5aa48a87a4f38/updateAdmin`)
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send({ newAdminId: memberA.id });
		expect(response.status).to.equal(400);
		expect(response.body.error).to.be.an('object').that.is.not.empty;
		expect(response.body.error.name).to.equal('BadRequest');
		expect(response.body.error.type).to.equal('InvalidParams');
		expect(response.body.error.message).to.equal(
			'Team 5d2141d9ded5aa48a87a4f38 does not exist'
		);
	});

	// Member A will try to set themself to team admin
	it('Should only allow team admin to edit team', async () => {
		// Let Member A Login to get token
		const loginResponse = await chai
			.request(app)
			.post('/login')
			.type('form')
			.send({
				email: memberA.email,
				password: 'password'
			});
		jwtToken = loginResponse.body.token;
		// Try to updateAdmin with member A token
		const response = await chai
			.request(app)
			.patch(`/team/${team.id}/updateAdmin`)
			.set('Authorization', `Bearer ${jwtToken}`)
			.type('form')
			.send({ newAdminId: memberA.id });
		expect(response.status).to.equal(403);
		expect(response.body.error).to.be.an('object').that.is.not.empty;
		expect(response.body.error.name).to.equal('Forbidden');
		expect(response.body.error.type).to.equal('AuthorizationError');
		expect(response.body.error.message).to.equal('Only Team Admin can edit team');
	});
});
